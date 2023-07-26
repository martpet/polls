import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getChoice, getGroup, getPoll } from "🛠️/db.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

import DeleteResourceView from "🧱/restful/DeleteResourceView.tsx";

interface Data {
  choice: Choice;
  poll: Poll;
  group: Group | null;
}

export async function handler(_: Request, ctx: HandlerContext<Data>) {
  const choice = await getChoice(ctx.params.slug);
  if (!choice) return ctx.renderNotFound();
  const poll = await getPoll(choice.poll);
  if (!poll) throw new Error("Missing poll");
  const group = poll.group ? (await getGroup(poll.group)) : null;
  if (poll.group && !group) throw new Error("Missing poll group");
  return ctx.render({ choice, poll, group });
}

export default function DeleteChoicePage({ data }: PageProps<Data>) {
  const { choice, poll, group } = data;
  return (
    <DeleteResourceView
      resourceType="choices"
      resource={choice}
      subline={`${group ? `${group.title}, ` : ""}${poll.title}`}
    />
  );
}
