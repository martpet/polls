import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getGroupBySlug, listPollsByGroup } from "🛠️/db.ts";
import { Group, Poll } from "🛠️/types.ts";

import DeleteResourceView from "🧱/resources/DeleteResourceView.tsx";

interface Data {
  group: Group;
  polls: Poll[];
}

export async function handler(_: Request, ctx: HandlerContext<Data>) {
  const group = await getGroupBySlug(ctx.params.slug);
  if (!group) return ctx.renderNotFound();
  const polls = await listPollsByGroup(group.id);
  return ctx.render({ group, polls });
}

export default function DeleteGroupPage({ data }: PageProps<Data>) {
  const { group, polls } = data;
  const blockage = (
    <p>
      За да изтриеш групата трябва първо да изтриеш всички анкети от тази група.
    </p>
  );
  return (
    <DeleteResourceView
      resourceType="groups"
      resource={group}
      blockage={polls.length && blockage}
    />
  );
}
