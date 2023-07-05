import { insertPhoneNumber } from "🛠️/db.ts";
import { getEnv } from "🛠️/env.ts";
import { fetchPhoneNumbers } from "🛠️/google-api.ts";
import { checkIsDemo, getHostInfo } from "🛠️/host.ts";
import { OAUTH_SCOPES } from "🛠️/oauth.ts";
import { AccountValidity, User } from "🛠️/types.ts";

export function canVote(user: User) {
  return user.accountValidity === "valid";
}

export function isAdmin(user: User) {
  return checkIsDemo() || user.id === getEnv("OWNER_GOOGLE_ID");
}

export async function validateAccount(user: User): Promise<AccountValidity> {
  const { phoneCode } = getHostInfo();
  if (!user.tokens.scope) {
    throw new Error("Missing scope field in user tokens");
  }
  if (!user.tokens.scope.includes(OAUTH_SCOPES.phone)) {
    return "phone_access_denied";
  }
  const phones = await fetchPhoneNumbers(user);
  if (!phones?.length) {
    return "phone_missing";
  }
  const withValidPhoneCode = phones.filter((phone) =>
    phone.canonicalForm.startsWith(phoneCode)
  );
  if (!withValidPhoneCode.length) {
    return "phone_country_code_bad";
  }
  const verifiedPhones = withValidPhoneCode.filter((phone) =>
    phone.metadata.verified
  );
  if (!verifiedPhones.length) {
    return "phone_unverified";
  }
  try {
    const insertionResults = await Promise.all(
      verifiedPhones.map((phone) => insertPhoneNumber(phone.canonicalForm)),
    );
    const okResponses = insertionResults.map((res) => res.ok);
    if (!okResponses.length) {
      return "phone_already_registered";
    }
    return "valid";
  } catch (e) {
    console.log(e);
    return "unknown_phone_error";
  }
}
