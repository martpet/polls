import { Tokens } from "oauth2_client";

export interface State {
  session: string | undefined;
}

export interface OauthSession {
  state: string;
  codeVerifier: string;
  from: string | null;
  createdAt: Date;
}

export interface User {
  id: string;
  tokens: Tokens & { addedAt: Date };
  accountValidity: AccountValidity;
  createdAt: Date;
}

export type AccountValidity = null | "valid" | PhoneError;

export type PhoneError =
  | "phone_access_denied"
  | "phone_missing"
  | "phone_country_code_bad"
  | "phone_unverified"
  | "phone_already_registered"
  | "unknown_phone_error";

export type AuthError =
  | "access_denied"
  | "unknown_auth_error";

export interface Poll {
  id: string;
  slug: string;
  title: string;
  expiresAt: Date | null;
  disabled: boolean;
  onHome?: boolean;
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
    | "expiresAt"
    | "disabled"
    | "order"
    | "choiceTitleLabel"
    | "choicePrefixLabel"
  > {
  id: string;
  slug: string;
  title: string;
  otherItemsLabel: string;
  createdAt: Date;
}

export interface Choice {
  id: string;
  poll: string;
  title: string;
  prefix: string;
  addition: string;
  createdAt: Date;
}

export interface ChoiceWithVotes extends Choice {
  votes: number;
}

export interface GlobalSettings {
  ipcountryFilter: boolean;
}

export type MappedCollectionMaybe<T> = T[] | Partial<Record<string, T[]>>;
