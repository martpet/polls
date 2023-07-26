import { ComponentChildren, JSX } from "preact";

import { PROSE, SIDE_SPACE } from "🛠️/constants.ts";

import BackLink from "🧱/BackLink.tsx";
import Container, { ContainerProps } from "🧱/Container.tsx";
import DocTitle from "🧱/DocTitle.tsx";
import Footer, { FooterProps } from "🧱/Footer.tsx";
import Header, { HeaderProps } from "🧱/Header.tsx";
import Heading from "🧱/Heading.tsx";

export interface ViewProps
  extends HeaderProps, Omit<JSX.HTMLAttributes<HTMLElement>, "resource"> {
  children?: ComponentChildren;
  width?: ContainerProps["width"];
  headline?: string;
  overline?: ComponentChildren;
  subline?: ComponentChildren;
  docTitle?: string;
  backLink?: Readonly<[string, string]> | null;
  breadcrumbs?: Record<string, string>;
  blankSlate?: ComponentChildren;
  headerContent?: ComponentChildren;
  noFooter?: boolean;
  center?: boolean;
  url?: URL;
  footerProps?: FooterProps;
  isLogoLink?: boolean;
}

export default function View(
  {
    children,
    width = "sm",
    headline,
    overline,
    subline,
    docTitle,
    backLink,
    breadcrumbs,
    blankSlate,
    headerContent,
    noFooter,
    center = true,
    url,
    footerProps,
    isLogoLink,
    ...wrapElProps
  }: ViewProps,
) {
  width = blankSlate ? "auto" : width;
  center = blankSlate ? true : center;

  let content;

  if (blankSlate) {
    content = blankSlate;
  } else {
    content = (
      <>
        {headline && (
          <Heading
            overline={overline}
            subline={subline}
          >
            {headline}
          </Heading>
        )}
        {children}
      </>
    );
  }

  return (
    <>
      <DocTitle>{docTitle || headline}</DocTitle>
      <Header
        breadcrumbs={breadcrumbs}
        headerContent={headerContent}
        isHeadingLogo={!headline && !blankSlate}
        isLogoLink={isLogoLink}
      />
      <main
        {...wrapElProps}
        class={`
          ${wrapElProps.class || ""}
          ${SIDE_SPACE} 
          pt-10 md:pt-16 pb-16 sm:pb-20
        `}
      >
        <>
          {backLink && (
            <BackLink
              href={backLink[1]}
              class="-mt-5 sm:-mt-11 mb-12 sm:mb-12 block"
            >
              {backLink[0]}
            </BackLink>
          )}
          <Container width={width} center={center} class={PROSE}>
            {content}
          </Container>
        </>
      </main>
      {(!blankSlate && !noFooter) && <Footer {...footerProps} />}
    </>
  );
}
