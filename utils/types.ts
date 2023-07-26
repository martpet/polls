import { Tokens } from "oauth2_client";

export interface State {
  session: string | undefined;
}

export interface OauthSession {
  state: string;
  codeVerifier: string;
  from: string | null;
  to: string | null;
  createdAt: Date;
}

export interface User {
  id: string;
  tokens: Tokens & { addedAt: Date };
  phoneStatus: PhoneStatus;
  createdAt: Date;
}

export type PhoneStatus = null | "valid" | PhoneError;

export type PhoneError =
  | "phone_access_denied"
  | "phone_missing"
  | "phone_country_code_bad"
  | "phone_unverified"
  | "phone_already_used"
  | "unknown_phone_error";

export type AuthError =
  | "access_denied"
  | "unknown_auth_error";

export interface Poll {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  expiresAt: Date | null;
  disabled: boolean;
  order: number | null;
  choiceTitleLabel: string;
  choicePrefixLabel: string;
  ipCityFilter: string;
  group: string;
  createdAt: Date;
}

export interface Group extends
  Pick<
    Poll,
    | "id"
    | "slug"
    | "title"
    | "expiresAt"
    | "disabled"
    | "order"
    | "choiceTitleLabel"
    | "choicePrefixLabel"
    | "createdAt"
  > {
  otherItemsLabel: string;
}

export interface Choice {
  id: string;
  poll: string;
  title: string;
  prefix: string;
  addition: string;
  createdAt: Date;
}

export interface ChoiceAndVotes extends Choice {
  votes: number;
}

export interface GlobalSettings {
  ipcountryFilter: boolean;
}

export type MappedCollectionMaybe<T> = T[] | Partial<Record<string, T[]>>;
