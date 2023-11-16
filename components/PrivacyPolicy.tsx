import { CONTACTS_PATH, PROFILE_PATH, PROFILE_RESET_PATH } from "🛠️/paths.ts";

import Link from "🧱/Link.tsx";

export default function PrivacyPolicy() {
  return (
    <>
      <h2>Какви лични данни се съхраняват?</h2>

      <ul>
        <li>телефонен номер</li>
        <li>
          <em>Google ID</em>
        </li>
        <li>гласувания</li>
      </ul>

      <h2>Защо се взимат данните?</h2>

      <p>
        Tелефонният номер — за да гласувате само с един профил.
      </p>
      <p>
        <em>Google ID</em> и гласуванията — за да редактирате гласуванията си.
      </p>

      <h2>Къде се съхраняват данните?</h2>
      <p>
        Данните се съхраняват се в облака на{" "}
        <Link href="https://deno.com/deploy/docs/regions">
          <em>Deno</em>
        </Link>.
      </p>

      <h2>Кой има достъп до данните?</h2>
      <p>
        Достъп има <Link href={CONTACTS_PATH}>авторът на сайта</Link>.
      </p>

      <h2>Какви са вашите права?</h2>
      <ul>
        <li>
          Можете да <Link href={PROFILE_PATH}>видите данните си</Link>.
        </li>
        <li>
          Можете да{"  "}
          <Link href={PROFILE_RESET_PATH}>
            изтриете гласувания си
          </Link>.
        </li>
      </ul>
    </>
  );
}
