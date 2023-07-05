import { ComponentChildren, JSX } from "preact";

import Link from "🧱/Link.tsx";

const linkClass = [
  "!no-underline",
  "[&:hover>.link-text]:underline",
];

interface BackLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  href: string;
}

export default function BackLink(
  { children, href, ...anchorProps }: BackLinkProps,
) {
  return (
    <>
      <Link
        {...anchorProps}
        href={href}
        class={`${anchorProps.class || ""} ${linkClass.join(" ")}`}
      >
        <span role="presentation" class="mr-1">⏴</span>
        <span class="link-text">
          {children}
        </span>
      </Link>
    </>
  );
}
