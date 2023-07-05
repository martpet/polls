import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getGroup, getHomePoll, getPollBySlug } from "🛠️/db.ts";
import { Group, Poll } from "🛠️/types.ts";

import EditPollView from "🧱/resources/polls/EditPollView.tsx";

interface Data {
  poll: Poll;
  group: Group | null;
}

export async function handler(_: Request, ctx: HandlerContext<Data>) {
  const poll = await getPollBySlug(ctx.params.slug);
  if (!poll) return ctx.renderNotFound();
  const [group, homePoll] = await Promise.all([
    getGroup(poll.group),
    getHomePoll(),
  ]);
  poll.onHome = poll.id === homePoll?.id;
  return ctx.render({ poll, group });
}

export default function EditPollPage({ data }: PageProps<Data>) {
  const { poll, group } = data;
  return (
    <EditPollView
      resource={poll}
      group={group}
    />
  );
}
