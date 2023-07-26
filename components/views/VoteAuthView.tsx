import { ComponentChild } from "preact";

import { authErrorsTexts } from "🛠️/constants.ts";
import { SIGN_IN_PATH, VALIDATE_PHONE_PATH } from "🛠️/paths.ts";
import { AuthError, PhoneError, User } from "🛠️/types.ts";

import Alert, { AlertActionLink } from "🧱/Alert.tsx";
import Button, { ButtonLink } from "🧱/Button.tsx";
import View from "🧱/View.tsx";

export const CONFIRM_PHONE_URL = "https://myaccount.google.com/phone";
export const EDIT_PHONE_URL = "https://myaccount.google.com/profile/phone/edit";
export const ADD_PHONE_URL =
  "https://myaccount.google.com/profile/phone/edit?add=true";

type AnyUserError = AuthError | PhoneError;

const alerts: Record<AnyUserError, ComponentChild> = {
  unknown_auth_error: authErrorsTexts["unknown_auth_error"],
  access_denied: authErrorsTexts["access_denied"],
  unknown_phone_error:
    "Получи се грешка при преглеждането на телефона. Моля, опитайте отново.",
  phone_access_denied: (
    <>
      <p>
        Влезте отново с <em>Google</em>{" "}
        и разрешете достъп до телефонния Ви номер.
      </p>
    </>
  ),
  phone_missing: (
    <>
      Не сте добавили телефонен номер в <em>Google</em> профила Ви.
      <AlertActionLink href={EDIT_PHONE_URL} target="blank">
        Добавете телефонен номер
      </AlertActionLink>
    </>
  ),
  phone_country_code_bad: (
    <>
      Нямате български телефонен номер в <em>Google</em> профила Ви.
      <AlertActionLink href={EDIT_PHONE_URL} target="blank">
        Добавете български телефонен номер
      </AlertActionLink>
    </>
  ),
  phone_unverified: (
    <>
      Вашият телефонен номер в <em>Google</em> е непотвърден.
      <AlertActionLink href={CONFIRM_PHONE_URL} target="blank">
        Потвърдете телефонния номер
      </AlertActionLink>
    </>
  ),
  phone_already_used: (
    <>
      Вашият телефонен е използван от друг <em>Google</em> профил.
      <AlertActionLink href={ADD_PHONE_URL} target="blank">
        Добавете друг телефонен номер
      </AlertActionLink>
    </>
  ),
};

const accessRequestErrors: AnyUserError[] = [
  "access_denied",
  "phone_access_denied",
  "unknown_auth_error",
];

interface Props {
  user: User | null;
  url: URL;
  headline?: string;
}

export default function VoteAuthView(props: Props) {
  const { user, url } = props;
  const authError = url.searchParams.get("error") as AuthError | null;
  const phoneError = user?.phoneStatus !== "valid" && user?.phoneStatus;
  const error = authError || phoneError;
  const alertMsg = error && alerts[error];
  const isAccessRequest = !error || accessRequestErrors.includes(error);
  const signinUrl = new URL(url);
  signinUrl.pathname = SIGN_IN_PATH;
  const phoneValidationUrl = new URL(url);
  phoneValidationUrl.pathname = VALIDATE_PHONE_PATH;
  [signinUrl, phoneValidationUrl].forEach((u) => {
    u.search = "";
    u.searchParams.set("from", url.pathname);
    u.searchParams.set("to", url.pathname.replace("/auth", "/vote"));
  });
  return (
    <View width="sm">
      {alertMsg && <Alert class="mb-10">{alertMsg}</Alert>}
      <h1>Продължете с Google</h1>
      <p class="lead mb-9">Потвърдете, че сте реален потребител.</p>
      {isAccessRequest && (
        <ButtonLink href={signinUrl.href}>
          Вход с Google
        </ButtonLink>
      )}
      {!isAccessRequest && (
        <form method="POST" action={phoneValidationUrl.href}>
          <Button>Готов съм</Button>
        </form>
      )}
    </View>
  );
}
