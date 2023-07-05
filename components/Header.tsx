import { ComponentChildren } from "preact";

import Breadcrumbs from "🧱/Breadcrumbs.tsx";
import LinkLogo from "🧱/LinkLogo.tsx";

const PADDING_X = "px-4";
const LG_PADDING_X = "lg:px-8";

const classes = [
  "flex",
  "items-center",
  "place-content-between",
  PADDING_X,
  LG_PADDING_X,
  "lg:px-8",
  "min-h-[61px]",
  "border-b",
  "border-slate-200",
  "dark:border-slate-800",
];

const breadcrumbsClasses = [
  "mt-4",
  PADDING_X,
  LG_PADDING_X,
];

export interface HeaderProps {
  breadcrumbs?: Record<string, string>;
  headerContent?: ComponentChildren;
  isLogoHeading?: boolean;
}

export default function Header(props: HeaderProps) {
  const { breadcrumbs, headerContent, isLogoHeading } = props;
  let logo = <LinkLogo />;
  if (isLogoHeading) logo = <h1>{logo}</h1>;
  return (
    <header>
      <div class={classes.join(" ")}>
        {logo}
        {headerContent}
      </div>
      {breadcrumbs && (
        <Breadcrumbs
          path={breadcrumbs}
          class={breadcrumbsClasses.join(" ")}
        />
      )}
    </header>
  );
}
