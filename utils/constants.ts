import { ALL_PATH } from "🛠️/paths.ts";
import { resourcesMeta } from "🛠️/resources/meta.ts";

export const EDIT_PHONE_URL = "https://myaccount.google.com/profile/phone/edit";
export const CONFIRM_PHONE_URL = "https://myaccount.google.com/phone";
export const GITHUB_URL = "http://github.com/martpet/polls";
export const EMAIL = "webmaster@glasuvane.com";

export const BACK_LINK_ALL = [resourcesMeta.polls.texts.all, ALL_PATH] as const;
