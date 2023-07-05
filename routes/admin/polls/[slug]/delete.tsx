import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getPollBySlug } from "🛠️/db.ts";
import { Poll } from "🛠️/types.ts";

import DeleteResourceView from "🧱/resources/DeleteResourceView.tsx";

interface Data {
  poll: Poll;
}

export async function handler(_: Request, ctx: HandlerContext<Data>) {
  const poll = await getPollBySlug(ctx.params.slug);
  if (!poll) return ctx.renderNotFound();
  return ctx.render({ poll });
}

export default function DeletePollPage({ data }: PageProps<Data>) {
  const { poll } = data;
  return (
    <DeleteResourceView
      resourceType="polls"
      resource={poll}
    />
  );
}
