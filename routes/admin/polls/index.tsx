import { Handlers, PageProps } from "$fresh/server.ts";

import {
  deletePoll,
  getGroup,
  getPoll,
  listGroups,
  listPollsByGroup,
  setPoll,
} from "🛠️/db.ts";
import { FormEntry, FormErrors, FormMethod, parseForm } from "🛠️/forms.ts";
import { dateFromLocalDateString } from "🛠️/intl.ts";
import { adminResourcePaths } from "🛠️/resources/functions.ts";
import { Group, Poll } from "🛠️/types.ts";

import ResourceListView from "🧱/resources/ResourceListView.tsx";
import EditPollView from "🧱/resources/polls/EditPollView.tsx";
import NewPollView from "🧱/resources/polls/NewPollView.tsx";
import PollsAndGroupsBlankSlate from "🧱/resources/polls/PollsAndGroupsBlankSlate.tsx";
import PollsAndGroupsTable from "🧱/resources/polls/PollsAndGroupsTable.tsx";

type ListData = {
  polls: Poll[];
  groups: Group[];
  group?: never;
  formEntry?: never;
  formErrors?: never;
  formMethod?: never;
};

type MutationData = {
  polls?: never;
  groups?: never;
  group: Group | null;
  formEntry: FormEntry<Poll>;
  formErrors: FormErrors<Poll>;
  formMethod: FormMethod;
};

type Data = ListData | MutationData;

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    const polls = await listPollsByGroup("");
    const groups = await listGroups();
    return ctx.render({ polls, groups });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const formMethod = form.get("_method")?.toString() as FormMethod;
    if (["post", "patch"].includes(formMethod)) {
      const groupId = form.get("group")?.toString();
      const group = groupId ? (await getGroup(groupId)) : null;
      if (groupId && !group) throw new Error("Missing group");
      const { formErrors, formEntry, newData } = parseForm<Poll>(form, {
        id: ["string"],
        slug: ["slug", "required"],
        title: ["required"],
        choiceTitleLabel: ["string"],
        choicePrefixLabel: ["string"],
        ipCityFilter: ["string"],
        disabled: ["boolean"],
        onHome: ["boolean"],
        order: ["number"],
        expiresAt: ["date"],
        group: ["string"],
      });
      if (formErrors) {
        return ctx.render({
          formErrors,
          formEntry,
          formMethod,
          group,
        });
      }
      let poll = newData;
      if (formMethod === "post") {
        poll.id = crypto.randomUUID();
        poll.createdAt = new Date();
        if (poll.expiresAt) {
          poll.expiresAt = dateFromLocalDateString(poll.expiresAt);
        }
      } else {
        const currentPoll = await getPoll(poll.id);
        if (!currentPoll) throw new Error("Cannot update missing Poll");
        poll = { ...currentPoll, ...poll };
      }
      const uniqueFieldsErrors = await setPoll(poll);
      if (uniqueFieldsErrors) {
        return ctx.render({
          formErrors: uniqueFieldsErrors,
          formEntry,
          formMethod,
          group,
        });
      }
      const pollPaths = adminResourcePaths({
        resourceType: "polls",
        resource: poll,
      });
      const groupPaths = adminResourcePaths({
        resourceType: "groups",
        resource: group,
      });
      const location = formMethod === "post"
        ? (group ? groupPaths.view! : pollPaths.base)
        : pollPaths.view!;
      return new Response(null, {
        headers: { location },
        status: 303,
      });
    } else if (formMethod === "delete") {
      const id = form.get("id")?.toString();
      if (!id) throw new Error("Missing poll id");
      const poll = await getPoll(id);
      if (!poll) throw new Error("Missing poll");
      const [group] = await Promise.all([
        poll.group ? getGroup(poll.group) : null,
        deletePoll(id),
      ]);
      const pollPaths = adminResourcePaths({ resourceType: "polls" });
      const groupPaths = adminResourcePaths({
        resourceType: "groups",
        resource: group,
      });
      return new Response(null, {
        headers: { location: group ? groupPaths.base : pollPaths.base },
        status: 303,
      });
    } else {
      throw new Error("Unknown form method");
    }
  },
};

export default function PollsPage({ data }: PageProps<Data>) {
  const { formErrors, formEntry, formMethod, group, polls, groups } = data;
  if (formErrors) {
    const FormView = formMethod === "post" ? NewPollView : EditPollView;
    return (
      <FormView
        formEntry={formEntry}
        formErrors={formErrors}
        group={group}
      />
    );
  }
  return (
    <ResourceListView
      resourceType="polls"
      blankSlate={!polls.length && !groups.length && (
        <PollsAndGroupsBlankSlate />
      )}
      view={
        <PollsAndGroupsTable
          polls={polls}
          groups={groups}
        />
      }
    />
  );
}
