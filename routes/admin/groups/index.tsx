import { Handlers, PageProps } from "$fresh/server.ts";

import { deleteGroup, getGroup, listPollsByGroup, setGroup } from "🛠️/db.ts";
import { FormEntry, FormErrors, FormMethod, parseForm } from "🛠️/forms.ts";
import { dateFromLocalDateString } from "🛠️/intl.ts";
import { adminResourcePaths } from "🛠️/resources/functions.ts";
import { Group } from "🛠️/types.ts";

import EditGroupView from "🧱/resources/groups/EditGroupView.tsx";
import NewGroupView from "🧱/resources/groups/NewGroupView.tsx";

type Data = {
  formEntry: FormEntry<Group>;
  formErrors: FormErrors<Group>;
  formMethod: FormMethod;
};

const pollPaths = adminResourcePaths({ resourceType: "polls" });

export const handler: Handlers<Data> = {
  GET() {
    return new Response(null, {
      headers: { location: pollPaths.base },
      status: 308,
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const formMethod = form.get("_method")?.toString() as FormMethod;
    if (["post", "patch"].includes(formMethod)) {
      const { formErrors, formEntry, newData } = parseForm<Group>(form, {
        id: ["string"],
        slug: ["slug", "required"],
        title: ["required"],
        choiceTitleLabel: ["string"],
        choicePrefixLabel: ["string"],
        otherItemsLabel: ["string"],
        order: ["number"],
        expiresAt: ["date"],
        disabled: ["boolean"],
      });
      if (formErrors) {
        return ctx.render({
          formErrors,
          formEntry,
          formMethod,
        });
      }
      let group = newData;
      if (formMethod === "post") {
        group.id = crypto.randomUUID();
        group.createdAt = new Date();
        if (group.expiresAt) {
          group.expiresAt = dateFromLocalDateString(group.expiresAt);
        }
      } else {
        const currentGroup = await getGroup(group.id);
        if (!currentGroup) throw new Error("Cannot update missing Group");
        group = { ...currentGroup, ...group };
      }
      const uniqueFieldsErrors = await setGroup(group);
      if (uniqueFieldsErrors) {
        return ctx.render({
          formErrors: uniqueFieldsErrors,
          formEntry,
          formMethod,
        });
      }
      const groupsPath = adminResourcePaths({
        resourceType: "groups",
        resource: group,
      });
      return new Response(null, {
        headers: {
          location: formMethod === "post" ? pollPaths.base : groupsPath.view!,
        },
        status: 303,
      });
    } else if (formMethod === "delete") {
      const id = form.get("id")?.toString();
      if (!id) throw new Error("Missing group id");
      const polls = await listPollsByGroup(id);
      if (!polls.length) await deleteGroup(id);
      return new Response(null, {
        headers: { location: pollPaths.base },
        status: 303,
      });
    } else {
      throw new Error("Unknown form method");
    }
  },
};

export default function GroupsPage({ data }: PageProps<Data>) {
  const { formErrors, formEntry, formMethod } = data;
  const FormView = formMethod === "post" ? NewGroupView : EditGroupView;
  return (
    <FormView
      formEntry={formEntry}
      formErrors={formErrors}
    />
  );
}
