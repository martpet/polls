import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getChoice, getGroup, getPoll } from "🛠️/db.ts";
import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

import ResourceView from "🧱/restful/ResourceView.tsx";
import ChoiceItem from "🧱/restful/choices/ChoiceItem.tsx";

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

export default function ChoicePage({ data }: PageProps<Data>) {
  const { choice, poll, group } = data;
  const pollPaths = adminResourcePaths({
    resourceType: "polls",
    resource: poll,
  });
  return (
    <ResourceView
      resourceType="choices"
      resource={choice}
      subline={group ? `${group.title}, ${poll.title}` : null}
      backLink={[poll.title, pollPaths.view!]}
      item={<ChoiceItem choice={choice} />}
    />
  );
}
