import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

import { deleteUserSession } from "🛠️/db.ts";
import { AUTH_PATH } from "🛠️/paths.ts";
import { State } from "🛠️/types.ts";

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    if (ctx.state.session) await deleteUserSession(ctx.state.session);
    const url = new URL(req.url);
    const targetUrl = new URL(url);
    targetUrl.pathname = url.searchParams.get("to") || AUTH_PATH;
    targetUrl.search = "";

    const resp = new Response("Logged out", {
      headers: { Location: targetUrl.href },
      status: 303,
    });
    deleteCookie(resp.headers, "session");
    return resp;
  },
};
