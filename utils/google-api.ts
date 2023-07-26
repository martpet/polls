import { Tokens } from "oauth2_client";

import { setUser } from "🛠️/db.ts";
import { GoogleApiError } from "🛠️/errors.ts";
import { getOauthClient } from "🛠️/oauth.ts";
import { User } from "🛠️/types.ts";

export interface GooglePhone {
  canonicalForm: string;
  metadata: { verified: true };
}

interface GoogleUser {
  "family_name": string;
  "name": string;
  "picture": string;
  "locale": string;
  "given_name": string;
  "id": string;
}

type TokensWithDateAddedMaybe =
  & Omit<User["tokens"], "addedAt">
  & Partial<Pick<User["tokens"], "addedAt">>;

async function query<T>(userOrTokens: User | Tokens, url: string): Promise<T> {
  let accessToken;
  if (checkIsTokens(userOrTokens)) {
    accessToken = userOrTokens.accessToken;
  } else {
    const user = userOrTokens;
    accessToken = (await refreshAccessToken(user)) || user.tokens.accessToken;
  }
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new GoogleApiError(data.error);
  }
  return data;
}

function checkIsTokens(obj: Tokens | unknown): obj is Tokens {
  return typeof (obj as Tokens).accessToken === "string";
}

async function refreshAccessToken(user: User) {
  const { tokens } = user;
  if (
    tokens.refreshToken &&
    tokens.addedAt &&
    tokens.expiresIn &&
    Date.now() > tokens.addedAt.getTime() + ((tokens.expiresIn - 20) * 1000)
  ) {
    const oauthClient = getOauthClient();
    const newTokens = await oauthClient.refreshToken.refresh(
      tokens.refreshToken,
    );
    await setUser({ ...user, tokens: { ...user.tokens, ...newTokens } });
    return newTokens.accessToken;
  }
}

export function getAuthenticatedUser(tokens: TokensWithDateAddedMaybe) {
  return query<GoogleUser>(
    tokens,
    "https://www.googleapis.com/oauth2/v2/userinfo",
  );
}

export async function fetchPhoneNumbers(user: User) {
  const data = await query<{ phoneNumbers: GooglePhone[] | null }>(
    user,
    "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
  );
  return data.phoneNumbers;
}
