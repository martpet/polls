import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";

import { getOauthSession, getUser, setUser, setUserSession } from "🛠️/db.ts";
import { getAuthenticatedUser } from "🛠️/google-api.ts";
import { getOauthClient, OAUTH_COOKIE } from "🛠️/oauth.ts";
import { AUTH_PATH } from "🛠️/paths.ts";
import { AuthError } from "🛠️/types.ts";
import { validatePhone } from "🛠️/user.ts";

export async function handler(req: Request) {
  const cookies = getCookies(req.headers);
  const oauthSessionCookie = cookies[OAUTH_COOKIE];
  if (!oauthSessionCookie) {
    return new Response("Missing oauth session cookie", { status: 400 });
  }
  const oauthSession = await getOauthSession(oauthSessionCookie);
  if (!oauthSession) {
    return new Response("Missing oauth session", {
      status: 400,
    });
  }

  const { from, to, state, codeVerifier } = oauthSession;

  let authError = new URL(req.url).searchParams.get("error") as AuthError ||
    null;

  if (authError) {
    if (authError !== "access_denied") authError = "unknown_auth_error";
    const targetUrl = new URL(req.url);
    targetUrl.pathname = from || AUTH_PATH;
    targetUrl.search = "";
    targetUrl.searchParams.set("error", authError);
    if (!from && to) targetUrl.searchParams.set("to", to);
    return new Response(null, {
      headers: { Location: targetUrl.href },
      status: 303,
    });
  }

  const tokens = await getOauthClient().code.getToken(req.url, {
    state,
    codeVerifier,
  });
  // todo: get id from id_token (decode with djwt), skip userinfo request.
  // (https://github.com/cmd-johnson/deno-oauth2-client/issues/28)
  const googleUser = await getAuthenticatedUser(tokens);
  const googleId = String(googleUser.id);
  let user = await getUser(googleId, { consistency: "eventual" });
  user = {
    ...user,
    id: googleId,
    tokens: { ...tokens, addedAt: new Date() },
    phoneStatus: user?.phoneStatus || null,
    createdAt: user?.createdAt || new Date(),
  };
  if (user.phoneStatus !== "valid") {
    user.phoneStatus = await validatePhone(user);
  }
  const session = crypto.randomUUID();
  await Promise.all([
    setUser(user),
    setUserSession(session, user.id),
  ]);
  const resp = new Response("Logged in", {
    headers: { Location: to || "/" },
    status: 303,
  });
  setCookie(resp.headers, {
    name: "session",
    value: session,
    path: "/",
    httpOnly: true,
  });
  deleteCookie(resp.headers, OAUTH_COOKIE);
  return resp;
}
