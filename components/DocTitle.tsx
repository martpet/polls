import { Head } from "$fresh/runtime.ts";

import { getEnv } from "🛠️/env.ts";
import { getHost } from "🛠️/host.ts";

interface DocTitleProps {
  children?: string;
}

export default function DocTitle({ children }: DocTitleProps) {
  const SITE_NAME = getEnv("BG_SITENAME");
  const { flag } = getHost();
  let docTitle = `${flag} ${SITE_NAME}`;
  if (children) docTitle = `${children} | ${docTitle}`;
  return (
    <Head>
      <title>
        {docTitle}
      </title>
    </Head>
  );
}
