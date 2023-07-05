import { JSX } from "preact";

import Link from "🧱/Link.tsx";

const navClasses = [
  "font-medium",
  "text-slate-900",
  "dark:text-slate-100",
];

const olClasses = [
  "flex",
  "[&>li:last-child_a]:text-inherit",
  "[&>li:last-child_a]:text-inherit",
  "[&>li:last-child_a]:!no-underline",
  "[&>li:last-child_a]:cursor-default",
];

const triangleClasses = [
  "mx-1.5",
  "text-inherit",
];

interface BreadcrumbsProps extends JSX.HTMLAttributes<HTMLElement> {
  path: Record<string, string>;
}

export default function Breadcrumbs({ path, ...navProps }: BreadcrumbsProps) {
  const entries = Object.entries(path);

  return (
    <nav
      {...navProps}
      aria-label="Breadcrumbs"
      class={`${navClasses.join(" ")} ${navProps.class || ""}`}
    >
      <ol class={olClasses.join(" ")}>
        {entries.map(([title, href], index) => {
          const isLast = index === entries.length - 1;

          return (
            <li>
              <Link href={href} aria-current={isLast && "location"}>
                {title}
              </Link>
              {!isLast &&
                (
                  <span aria-hidden="true" class={triangleClasses.join(" ")}>
                    ⏵
                  </span>
                )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
