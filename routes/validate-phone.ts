import { Handlers } from "$fresh/server.ts";

import { getUserBySession, setUser } from "🛠️/db.ts";
import { State } from "🛠️/types.ts";
import { validatePhone } from "🛠️/user.ts";

export const handler: Handlers<undefined, State> = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    if (!from) throw new Error('Missing "from" search param');
    if (!to) throw new Error('Missing "to" search param');
    const user = await getUserBySession(ctx.state.session);
    if (!user) {
      return new Response(null, {
        headers: { Location: from },
        status: 303,
      });
    }
    if (user.phoneStatus !== "phone_access_denied") {
      const status = await validatePhone(user);
      if (user.phoneStatus !== status) {
        user.phoneStatus = status;
        await setUser(user);
      }
    }
    return new Response(null, {
      headers: { Location: to },
      status: 303,
    });
  },
};
