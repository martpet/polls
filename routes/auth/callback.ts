import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";

import { getOauthSession, getUser, setUser, setUserSession } from "🛠️/db.ts";
import { getAuthenticatedUser } from "🛠️/google-api.ts";
import { getOauthClient, OAUTH_COOKIE } from "🛠️/oauth.ts";
import { AuthError } from "🛠️/types.ts";
import { validateAccount } from "🛠️/user.ts";
import { AUTH_PATH } from "../../utils/paths.ts";

export async function handler(req: Request) {
  const cookies = getCookies(req.headers);
  const oauthSessionCookie = cookies[OAUTH_COOKIE];
  if (!oauthSessionCookie) {
    return new Response("Missing oauth session cookie", {
      status: 400,
    });
  }
  const oauthSession = await getOauthSession(oauthSessionCookie);
  if (!oauthSession) {
    return new Response("Missing oauth session", {
      status: 400,
    });
  }
  const url = new URL(req.url);
  const { from, state, codeVerifier } = oauthSession;

  let oauthError = url.searchParams.get("error") as AuthError || null;
  if (oauthError) {
    if (oauthError !== "access_denied") oauthError = "unknown_auth_error";
    let location = `${AUTH_PATH}?error=${oauthError}`;
    if (from) location += `&from=${from}`;
    return new Response(null, {
      headers: { Location: location },
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
    accountValidity: user?.accountValidity || null,
    createdAt: user?.createdAt || new Date(),
  };
  if (user.accountValidity !== "valid") {
    user.accountValidity = await validateAccount(user);
  }
  const session = crypto.randomUUID();
  await Promise.all([
    setUser(user),
    setUserSession(session, user.id),
  ]);
  const resp = new Response("Logged in", {
    headers: { Location: from || "/" },
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
