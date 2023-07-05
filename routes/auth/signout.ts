import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";
import { deleteUserSession } from "🛠️/db.ts";
import { State } from "🛠️/types.ts";

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    if (ctx.state.session) await deleteUserSession(ctx.state.session);
    const targetUrl = new URL(req.url);
    targetUrl.pathname = "/";
    const location = targetUrl.searchParams.get("to");
    if (location) {
      targetUrl.pathname = location;
    }
    const resp = new Response("Logged out", {
      headers: { Location: targetUrl.href },
      status: 303,
    });
    deleteCookie(resp.headers, "session");
    return resp;
  },
};
