import { Handlers } from "$fresh/server.ts";

import { getUserBySession, setUser } from "🛠️/db.ts";
import { AUTH_PATH } from "🛠️/paths.ts";
import { State } from "🛠️/types.ts";
import { validateAccount } from "🛠️/user.ts";

export const handler: Handlers<undefined, State> = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const from = url.searchParams.get("from") || "";
    const user = await getUserBySession(ctx.state.session);
    if (!user) {
      return new Response("Auth", {
        headers: { Location: `${AUTH_PATH}?from=${from}` },
        status: 303,
      });
    }
    if (user.accountValidity !== "phone_access_denied") {
      const newCheck = await validateAccount(user);
      if (user.accountValidity !== newCheck) {
        user.accountValidity = newCheck;
        await setUser(user);
      }
    }
    return new Response(null, {
      headers: { Location: from },
      status: 303,
    });
  },
};
