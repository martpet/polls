import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

import { GoogleApiError } from "🛠️/errors.ts";
import { setHost } from "🛠️/host.ts";
import { AUTH_PATH, SIGN_OUT_PATH } from "🛠️/paths.ts";
import { AuthError, State } from "🛠️/types.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const cookies = getCookies(req.headers);
  const url = new URL(req.url);
  setHost(url.host);
  ctx.state.session = cookies.session;
  try {
    const res = await ctx.next();
    if (!res.headers.has("Cache-Control")) {
      res.headers.set("Cache-Control", "no-cache");
    }
    return res;
  } catch (e) {
    if (e instanceof GoogleApiError) {
      const targetUrl = new URL(SIGN_OUT_PATH);
      const authError: AuthError = "unknown_auth_error";
      targetUrl.searchParams.set("to", `${AUTH_PATH}?error=${authError}`);
      return new Response(null, {
        headers: { Location: targetUrl.href },
        status: 303,
      });
    }
    throw new Error(e);
  }
}
