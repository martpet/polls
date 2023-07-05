import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getUserBySession } from "🛠️/db.ts";
import { AuthError, State, User } from "🛠️/types.ts";
import { canVote } from "🛠️/user.ts";

import VoterAuthView from "🧱/views/VoterAuthView.tsx";

interface Data {
  user: User | null;
}

export async function handler(_req: Request, ctx: HandlerContext<Data, State>) {
  const user = await getUserBySession(ctx.state.session);
  if (user && canVote(user)) {
    return new Response(null, {
      headers: { Location: "/" },
      status: 303,
    });
  }
  return ctx.render({ user });
}

export default function VoterAuthPage({ data, url }: PageProps<Data>) {
  const { user } = data;
  const from = url.searchParams.get("from");
  const authError = url.searchParams.get("error") as AuthError | null;
  return (
    <VoterAuthView
      user={user}
      authError={authError}
      from={from}
    />
  );
}
