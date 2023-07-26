import { Handlers, PageProps } from "$fresh/server.ts";

import { deleteChoice, getChoice, getGroup, getPoll, setChoice } from "🛠️/db.ts";
import { FormEntry, FormErrors, FormMethod, parseForm } from "🛠️/forms.ts";
import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

import EditChoiceView from "🧱/restful/choices/EditChoiceView.tsx";
import NewChoiceView from "🧱/restful/choices/NewChoiceView.tsx";

interface Data {
  poll: Poll;
  group: Group | null;
  formEntry: FormEntry<Choice>;
  formErrors: FormErrors<Choice>;
  formMethod: FormMethod;
}

export const handler: Handlers<Data> = {
  GET() {
    const pollPaths = adminResourcePaths({ resourceType: "polls" });
    return new Response(null, {
      headers: { location: pollPaths.base },
      status: 308,
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const formMethod = form.get("_method")?.toString() as FormMethod;
    if (["post", "patch"].includes(formMethod)) {
      const pollId = form.get("poll")?.toString();
      if (!pollId) throw new Error("Missing poll id");
      const poll = await getPoll(pollId);
      if (!poll) throw new Error("Missing poll");
      const group = poll.group ? (await getGroup(poll.group)) : null;
      if (poll.group && !group) throw new Error("Missing poll group");
      const { formErrors, formEntry, newData } = parseForm<Choice>(form, {
        id: ["string"],
        title: ["required"],
        prefix: ["string"],
        addition: ["string"],
        poll: ["required"],
      });
      if (formErrors) {
        return ctx.render({
          formErrors,
          formEntry,
          formMethod,
          poll,
          group,
        });
      }
      let choice = newData;
      if (formMethod === "post") {
        choice.id = crypto.randomUUID();
        choice.createdAt = new Date();
      } else {
        const currentChoice = await getChoice(choice.id);
        if (!currentChoice) throw new Error("Cannot update missing Choice");
        choice = { ...currentChoice, ...choice };
      }
      const uniqueFieldsErrors = await setChoice(choice);
      if (uniqueFieldsErrors) {
        return ctx.render({
          formErrors: uniqueFieldsErrors,
          formEntry,
          formMethod,
          poll,
          group,
        });
      }
      const choicesPaths = adminResourcePaths({
        resourceType: "choices",
        resource: choice,
      });
      const pollPaths = adminResourcePaths({
        resourceType: "polls",
        resource: poll,
      });
      return new Response(null, {
        headers: {
          location: formMethod === "post"
            ? pollPaths.view!
            : choicesPaths.view!,
        },
        status: 303,
      });
    } else if (formMethod === "delete") {
      const id = form.get("id")?.toString();
      if (!id) throw new Error("Missing choice id");
      await deleteChoice(id);
      const pollPaths = adminResourcePaths({ resourceType: "polls" });
      return new Response(null, {
        headers: { location: pollPaths.base },
        status: 303,
      });
    } else {
      throw new Error("Unknown form method");
    }
  },
};

export default function ChoicesPage({ data }: PageProps<Data>) {
  const { formErrors, formEntry, formMethod, poll, group } = data;
  const FormView = formMethod === "post" ? NewChoiceView : EditChoiceView;
  return (
    <FormView
      formEntry={formEntry}
      formErrors={formErrors}
      poll={poll}
      group={group}
    />
  );
}
