import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

import { setOauthSession } from "🛠️/db.ts";
import { getOauthClient, OAUTH_COOKIE } from "🛠️/oauth.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const oauthSession = crypto.randomUUID();
    const stateNonce = crypto.randomUUID();
    const { origin } = new URL(req.url);
    const state = encodeURI(JSON.stringify({ stateNonce, origin }));
    const oauthClient = getOauthClient();
    const { uri, codeVerifier } = await oauthClient.code
      .getAuthorizationUri({ state });
    setOauthSession(oauthSession, {
      state,
      codeVerifier,
      from: url.searchParams.get("from"),
      to: url.searchParams.get("to"),
      createdAt: new Date(),
    });
    const resp = new Response("Redirecting...", {
      headers: { Location: uri.href },
      status: 303,
    });
    setCookie(resp.headers, {
      name: OAUTH_COOKIE,
      value: oauthSession,
      path: "/",
      httpOnly: true,
    });
    return resp;
  },
};
