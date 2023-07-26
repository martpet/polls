import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";

import { GoogleApiError } from "🛠️/errors.ts";
import { setHostname } from "🛠️/host.ts";
import { AUTH_PATH } from "🛠️/paths.ts";
import { AuthError, State } from "🛠️/types.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const { session } = getCookies(req.headers);
  const url = new URL(req.url);
  setHostname(url.host);
  ctx.state.session = session;
  try {
    const res = await ctx.next();
    if (!res.headers.has("Cache-Control")) {
      res.headers.set("Cache-Control", "no-cache");
    }
    return res;
  } catch (error) {
    if (error instanceof GoogleApiError) {
      const from = url.searchParams.get("from");
      const targetUrl = new URL(url);
      const errorType: AuthError = "unknown_auth_error";
      targetUrl.pathname = from || AUTH_PATH;
      targetUrl.search = "";
      targetUrl.searchParams.set("error", errorType);
      const resp = new Response(null, {
        headers: { Location: targetUrl.href },
        status: 303,
      });
      deleteCookie(resp.headers, "session");
      return resp;
    }
    throw new Error(error);
  }
}
