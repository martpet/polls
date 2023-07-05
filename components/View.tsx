import { ComponentChildren } from "preact";

import BackLink from "🧱/BackLink.tsx";
import Container, { ContainerProps } from "🧱/Container.tsx";
import DocTitle from "🧱/DocTitle.tsx";
import Header, { HeaderProps } from "🧱/Header.tsx";
import Heading from "🧱/Heading.tsx";
import Prose from "🧱/Prose.tsx";

export interface ViewProps extends HeaderProps {
  children?: ComponentChildren;
  width?: ContainerProps["width"];
  headline?: string;
  overline?: ComponentChildren;
  subline?: ComponentChildren;
  docTitle?: string;
  backLink?: Readonly<[string, string]> | null;
  breadcrumbs?: Record<string, string>;
  headerContent?: ComponentChildren;
  blankSlate?: ComponentChildren;
  notProse?: boolean;
  center?: boolean;
}

export default function View(
  {
    children,
    width = "md",
    headline,
    overline,
    subline,
    docTitle,
    backLink,
    breadcrumbs,
    blankSlate,
    headerContent,
    notProse,
    center = true,
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
        isLogoHeading={!headline}
      />
      <main class="pt-10 md:pt-20 px-4 lg:px-8 pb-20">
        <>
          {backLink && (
            <div class="block mb-10 md:mb-12 -mt-5 md:-mt-16">
              <BackLink href={backLink[1]}>
                {backLink[0]}
              </BackLink>
            </div>
          )}
          <Container
            width={width}
            center={center}
          >
            {notProse ? content : <Prose>{content}</Prose>}
          </Container>
        </>
      </main>
    </>
  );
}
