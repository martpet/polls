import { OAuth2Client } from "oauth2_client";

import { getEnv } from "🛠️/env.ts";
import { checkDemo, checkProd, getHostname } from "🛠️/host.ts";

export const OAUTH_COOKIE = "oauth";

export const OAUTH_SCOPES = {
  profile: "https://www.googleapis.com/auth/userinfo.profile",
  phone: "https://www.googleapis.com/auth/user.phonenumbers.read",
};

export function getOauthClient() {
  const oauthProxy = getEnv("DEV_OAUTH_PROXY");
  const isProd = checkProd();
  const isDemo = checkDemo();

  const clientId = getEnv(
    isProd
      ? "GOOGLE_CLIENT_ID"
      : isDemo
      ? "DEMO_GOOGLE_CLIENT_ID"
      : "DEV_GOOGLE_CLIENT_ID",
  );

  const clientSecret = getEnv(
    isProd
      ? "GOOGLE_CLIENT_SECRET"
      : isDemo
      ? "DEMO_GOOGLE_CLIENT_SECRET"
      : "DEV_GOOGLE_CLIENT_SECRET",
  );

  const authorizationEndpointUri = isProd || isDemo
    ? "https://accounts.google.com/o/oauth2/v2/auth"
    : oauthProxy;

  const tokenUri = "https://oauth2.googleapis.com/token";

  const redirectUri =
    (isProd || isDemo ? `https://${getHostname()}` : oauthProxy) +
    "/auth/callback";

  return new OAuth2Client({
    clientId,
    clientSecret,
    authorizationEndpointUri,
    tokenUri,
    redirectUri,
    defaults: {
      scope: [
        OAUTH_SCOPES.profile,
        OAUTH_SCOPES.phone,
      ],
    },
  });
}
