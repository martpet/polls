import { ComponentChildren } from "preact";

import { BORDER_COLOR, SIDE_SPACE } from "🛠️/constants.ts";
import Breadcrumbs from "🧱/Breadcrumbs.tsx";
import Logo from "🧱/Logo.tsx";

export interface HeaderProps {
  breadcrumbs?: Record<string, string>;
  headerContent?: ComponentChildren;
  isHeadingLogo?: boolean;
  isLogoLink?: boolean;
}

export default function Header(props: HeaderProps) {
  const {
    breadcrumbs,
    headerContent,
    isHeadingLogo,
    isLogoLink,
  } = props;

  let logo = <Logo isLink={isLogoLink} />;
  if (isHeadingLogo) logo = <h1>{logo}</h1>;

  return (
    <header>
      <div
        class={`
          ${SIDE_SPACE}
          ${BORDER_COLOR}
          place-content-between
          items-center
          flex
          py-2
          border-b
        `}
      >
        {logo}
        {headerContent}
      </div>
      {breadcrumbs && (
        <Breadcrumbs
          path={breadcrumbs}
          class={`
            ${SIDE_SPACE}
            mt-4
          `}
        />
      )}
    </header>
  );
}
