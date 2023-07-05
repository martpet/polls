import { MiddlewareHandlerContext } from "$fresh/server.ts";

import { getUserBySession } from "🛠️/db.ts";
import { GOOGLE_AUTH_PATH } from "🛠️/paths.ts";
import { State } from "🛠️/types.ts";
import { isAdmin } from "🛠️/user.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const user = await getUserBySession(ctx.state.session);
  if (!user) {
    const url = new URL(req.url);
    return new Response("Auth", {
      headers: { location: `${GOOGLE_AUTH_PATH}?from=${url.pathname}` },
      status: 303,
    });
  } else if (!isAdmin(user)) {
    return new Response("You are not an admin", { status: 403 });
  }
  return ctx.next();
}
