import { Head } from "$fresh/runtime.ts";

const SITE_NAME = "гласуване";

interface DocTitleProps {
  children?: string;
}

export default function DocTitle(props: DocTitleProps) {
  const { children } = props;
  return (
    <Head>
      <title>
        {children ? `${SITE_NAME} | ${children}` : SITE_NAME}
      </title>
    </Head>
  );
}
