import { getEnv } from "🛠️/env.ts";
import { checkDemo, getHost } from "🛠️/host.ts";

interface Props {
  isLink?: boolean;
}

export default function Logo({ isLink = true }: Props) {
  const { flag } = getHost();
  const siteName = checkDemo() ? "polls" : getEnv("BG_SITENAME");

  const logo = (
    <span
      class={`
        flex
        items-center
        justify-center
        gap-1
      `}
    >
      <span
        class={`
          text-2xl
          inline-block
        `}
      >
        {flag}
      </span>
      <span
        class={`
          dark:text-slate-300
          [a:hover_&]:underline
          tracking-wide
        `}
      >
        {siteName}
      </span>
    </span>
  );

  if (isLink) {
    return (
      <a href="/" aria-label="Начална страница" class="!hover:no-underline">
        {logo}
      </a>
    );
  }

  return logo;
}
