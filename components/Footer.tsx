import { JSX } from "preact";

import { BORDER_COLOR, PROSE, SIDE_SPACE } from "🛠️/constants.ts";
import { CONTACTS_PATH, PRIVACY_POLICY_PATH } from "🛠️/paths.ts";
import Link from "🧱/Link.tsx";

export interface FooterProps extends JSX.HTMLAttributes<HTMLElement> {
  hidePrivacyPolicy?: boolean;
  hideContacts?: boolean;
}

export default function Footer(props: FooterProps) {
  const { hidePrivacyPolicy, hideContacts } = props;

  const links: { text: string; url: string }[] = [];

  if (!hidePrivacyPolicy) {
    links.push({
      text: "Декларация за поверителност",
      url: PRIVACY_POLICY_PATH,
    });
  }

  if (!hideContacts) {
    links.push({
      text: "Контакти",
      url: CONTACTS_PATH,
    });
  }

  return (
    <footer
      {...props}
      class={`
        ${props.class || ""}
        ${PROSE}
        ${SIDE_SPACE}
        ${BORDER_COLOR}
        pt-4
        pb-8
        border-t
      `}
    >
      <ul class="m-0 p-0">
        {links.map(({ text, url }) => (
          <li class="list-none px-0">
            <Link href={url}>
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
