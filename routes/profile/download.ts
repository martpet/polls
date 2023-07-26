import { Handlers } from "$fresh/server.ts";

import { getUserBySession, listUserVotes } from "🛠️/db.ts";
import { State } from "🛠️/types.ts";

export const handler: Handlers<undefined, State> = {
  async GET(_req, ctx) {
    const user = await getUserBySession(ctx.state.session);
    if (!user) {
      return new Response(null, { status: 401 });
    }
    const votes = await listUserVotes(user.id, { consistency: "eventual" });
    const userData = {
      user: {
        id: user.id,
        phoneStatus: user.phoneStatus,
        createdAt: user.createdAt,
      },
      votes,
    };
    return new Response(JSON.stringify(userData, null, 2), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
