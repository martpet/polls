import { MiddlewareHandlerContext } from "$fresh/server.ts";

import { getUserBySession } from "🛠️/db.ts";
import { AUTH_PATH } from "🛠️/paths.ts";
import { State } from "🛠️/types.ts";
import { isAdmin } from "🛠️/user.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const user = await getUserBySession(ctx.state.session);
  if (!user) {
    const url = new URL(req.url);
    const targetUrl = new URL(url);
    targetUrl.pathname = AUTH_PATH;
    targetUrl.search = "";
    targetUrl.searchParams.set("to", url.pathname);
    return new Response("Auth", {
      headers: { location: targetUrl.href },
      status: 303,
    });
  } else if (!isAdmin(user)) {
    return new Response("You are not an admin", { status: 403 });
  }
  return ctx.next();
}
