import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getGroupBySlug } from "🛠️/db.ts";
import { Group } from "🛠️/types.ts";

import EditGroupView from "🧱/restful/groups/EditGroupView.tsx";

interface Data {
  group: Group;
}

export async function handler(_: Request, ctx: HandlerContext<Data>) {
  const group = await getGroupBySlug(ctx.params.slug);
  if (!group) return ctx.renderNotFound();
  return ctx.render({ group });
}

export default function EditGroupPage(viewProps: PageProps<Data>) {
  const { data } = viewProps;
  const { group } = data;

  return (
    <EditGroupView
      resource={group}
    />
  );
}
