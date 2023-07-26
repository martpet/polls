import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getUserBySession } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";
import { canVote } from "🛠️/user.ts";

import VoteAuthView from "🧱/views/VoteAuthView.tsx";

interface Data {
  user: User | null;
}

export async function handler(req: Request, ctx: HandlerContext<Data, State>) {
  const user = await getUserBySession(ctx.state.session);
  if (user && canVote(user)) {
    return new Response(null, {
      headers: {
        Location: new URL(req.url).pathname.replace("/auth", "/vote"),
      },
      status: 303,
    });
  }
  return ctx.render({ user });
}

export default function VoterAuthPage({ data, url }: PageProps<Data>) {
  const { user } = data;
  return (
    <VoteAuthView
      user={user}
      url={url}
    />
  );
}
