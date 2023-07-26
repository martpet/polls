import { Handlers, PageProps } from "$fresh/server.ts";

import { getGroup, getPollBySlug, listChoicesByPoll } from "🛠️/db.ts";
import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

import ResourceView from "🧱/restful/ResourceView.tsx";
import ChoicesTable from "🧱/restful/choices/ChoicesTable.tsx";
import PollItem from "🧱/restful/polls/PollItem.tsx";

interface Data {
  poll: Poll;
  group: Group | null;
  choices: Choice[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const poll = await getPollBySlug(ctx.params.slug);
    if (!poll) return ctx.renderNotFound();
    const [choices, group] = await Promise.all([
      listChoicesByPoll(poll.id),
      getGroup(poll.group),
    ]);
    return ctx.render({ poll, group, choices });
  },
};

export default function PollPage({ data }: PageProps<Data>) {
  const { poll, group, choices } = data;
  const groupPaths = adminResourcePaths({
    resourceType: "groups",
    resource: group,
  });
  return (
    <ResourceView
      resourceType="polls"
      resource={poll}
      backLink={group && [group.title, groupPaths.view!]}
      item={<PollItem poll={poll} group={group} />}
      subtitle={poll.subtitle}
      related={[{
        resourceType: "choices",
        item: <ChoicesTable choices={choices} poll={poll} />,
      }]}
    />
  );
}
