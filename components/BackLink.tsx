import { ComponentChildren, JSX } from "preact";

import Link from "🧱/Link.tsx";

interface BackLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  href: string;
}

export default function BackLink(
  { children, href, ...elementProps }: BackLinkProps,
) {
  return (
    <>
      <Link
        {...elementProps}
        href={href}
        class={`
          ${elementProps.class || ""} 
          !no-underline
          [&:hover>.link-text]:underline
        `}
      >
        <span role="presentation" class="mr-1">⏴</span>
        <span class="link-text">
          {children}
        </span>
      </Link>
    </>
  );
}
