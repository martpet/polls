import { ComponentChild } from "preact";
import {
  CONFIRM_PHONE_URL,
  EDIT_PHONE_URL,
  EMAIL,
  GITHUB_URL,
} from "🛠️/constants.ts";
import {
  PRIVACY_POLICY_PATH,
  SIGN_IN_PATH,
  VALIDATE_ACCOUNT_PATH,
} from "🛠️/paths.ts";
import { AuthError, PhoneError, User } from "🛠️/types.ts";

import Alert, { AlertActionLink } from "🧱/Alert.tsx";
import Button, { ButtonLink } from "🧱/Button.tsx";
import Highlight from "🧱/Highlight.tsx";
import View from "🧱/View.tsx";

type AnyUserError = AuthError | PhoneError;

const alerts: Record<AnyUserError, ComponentChild> = {
  unknown_auth_error: "Случи се непредвидена грешка. Моля, опитайте отново.",
  unknown_phone_error:
    "Получи се грешка при преглеждането на телефона. Моля, опитайте отново.",
  access_denied: "Вие отказахте достъп до Вашия Гугъл профил.",
  phone_access_denied: "Вие не дадохте достъп до Вашия телефонен номер.",
  phone_missing: (
    <>
      Не сте добавили телефонен номер във Вашия Гугъл профил.
      <AlertActionLink href={EDIT_PHONE_URL} target="blank">
        Добавете телефонен номер
      </AlertActionLink>
    </>
  ),
  phone_country_code_bad: (
    <>
      Не сте добавили български телефонен номер в Гугъл.
      <AlertActionLink href={EDIT_PHONE_URL} target="blank">
        Добавете български телефонен номер
      </AlertActionLink>
    </>
  ),
  phone_unverified: (
    <>
      Вашият телефонен номер трябва да бъде потвърден.
      <AlertActionLink href={CONFIRM_PHONE_URL} target="blank">
        Потвърдете телефона си
      </AlertActionLink>
    </>
  ),
  phone_already_registered: (
    <>
      Вашият телефонен номер вече е бил ползван от друг Гугъл профил. Моля,
      добавете нов телефонен номер или влезте през другия си Гугъл профил.
      <AlertActionLink href={EDIT_PHONE_URL} target="blank">
        Добавете нов телефонен номер
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
  authError: AuthError | null;
  headline?: string;
  from: string | null;
}

export default function VoterAuthView(props: Props) {
  const { user, authError, from } = props;
  const phoneError = user?.accountValidity !== "valid" &&
    user?.accountValidity;
  const error = authError || phoneError;
  const alert = error && alerts[error];
  const isAccessRequest = !error || accessRequestErrors.includes(error);
  let signinPath = SIGN_IN_PATH;
  let validateAccountPath = VALIDATE_ACCOUNT_PATH;
  if (from) {
    const query = `?from=${from}`;
    signinPath += query;
    validateAccountPath += query;
  }
  return (
    <View headline="Спам защита" width="sm">
      {alert && <Alert>{alert}</Alert>}
      {isAccessRequest && (
        <p class="lead">
          Разрешете да погледна телефонния Ви номер от Гугъл профила Ви, за да
          се уверя, че започва с <em>+359</em>.
        </p>
      )}
      <div class="my-10">
        {isAccessRequest
          ? <ButtonLink href={signinPath}>Разрешете достъп</ButtonLink>
          : (
            <form method="POST" action={validateAccountPath}>
              <Button>Готов съм</Button>
            </form>
          )}
      </div>
      <p>
        <Highlight>Сайтът не споделя личните Ви данни.</Highlight> Вижте{" "}
        <a href={PRIVACY_POLICY_PATH}>политиката за поверителност</a>.
        Разгледайте <a href={GITHUB_URL}>изходния код</a>. Пишете на{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </View>
  );
}
