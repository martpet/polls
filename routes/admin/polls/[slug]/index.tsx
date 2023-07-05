import { Handlers, PageProps } from "$fresh/server.ts";

import {
  getGroup,
  getHomePoll,
  getPollBySlug,
  listChoicesByPoll,
} from "🛠️/db.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

import { adminResourcePaths } from "🛠️/resources/functions.ts";
import ResourceView from "🧱/resources/ResourceView.tsx";
import ChoicesTable from "🧱/resources/choices/ChoicesTable.tsx";
import PollItem from "🧱/resources/polls/PollItem.tsx";

interface Data {
  poll: Poll;
  group: Group | null;
  choices: Choice[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const poll = await getPollBySlug(ctx.params.slug);
    if (!poll) return ctx.renderNotFound();
    const [choices, group, homePoll] = await Promise.all([
      listChoicesByPoll(poll.id),
      getGroup(poll.group),
      getHomePoll(),
    ]);
    poll.onHome = poll.id === homePoll?.id;
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
      related={[{
        resourceType: "choices",
        item: <ChoicesTable choices={choices} poll={poll} />,
      }]}
    />
  );
}
