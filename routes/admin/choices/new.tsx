import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getGroup, getPoll } from "🛠️/db.ts";
import { Group, Poll } from "🛠️/types.ts";

import NewChoiceView from "🧱/restful/choices/NewChoiceView.tsx";

interface Data {
  poll: Poll;
  group: Group | null;
}

export async function handler(req: Request, ctx: HandlerContext<Data>) {
  const url = new URL(req.url);
  const pollId = url.searchParams.get("poll");
  if (!pollId) throw new Error("Missing `poll` search param");
  const poll = await getPoll(pollId);
  if (!poll) throw new Error("Missing poll");
  const group = poll.group ? (await getGroup(poll.group)) : null;
  if (poll.group && !group) throw new Error("Missing poll group");
  return ctx.render({ poll, group });
}

export default function NewChoicePage({ data }: PageProps<Data>) {
  const { poll, group } = data;
  return (
    <NewChoiceView
      poll={poll}
      group={group}
    />
  );
}
