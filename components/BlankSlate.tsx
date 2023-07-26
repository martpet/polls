import { ComponentChildren, JSX } from "preact";

import Container from "🧱/Container.tsx";

const wrapperClasses = [
  "absolute",
  "left-1/2",
  "top-1/2",
  "translate-x-[-50%]",
  "translate-y-[-50%]",
  "w-max",
  "max-w-full",
  "[&_pre]:whitespace-normal",
  "[&_pre]:text-left",
];

const containerClasses = [
  "flex",
  "flex-col",
  "items-center",
  "text-center",
  "px-3",
  "gap-10",
];

const headlineClasses = [
  "text-2xl",
  "font-bold",
  "mb-5",
];

const emojiClassesBase = [
  "text-9xl",
];

const emojiClassesGrayscale = [
  "grayscale",
];

interface Props extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "icon"> {
  headline: ComponentChildren;
  subline?: ComponentChildren;
  icon?: ComponentChildren;
  grayscale?: boolean;
  fullWidth?: boolean;
}

export default function BlankSlate(props: Props) {
  const {
    headline,
    subline,
    icon = "🧐",
    grayscale,
    fullWidth,
  } = props;

  const emojiClasses = [emojiClassesBase];

  if (grayscale) {
    emojiClasses.push(emojiClassesGrayscale);
  }

  return (
    <div class={wrapperClasses.join(" ")}>
      <Container
        width={fullWidth ? "auto" : "md"}
        class={containerClasses.join(" ")}
      >
        <span role="presentation" class={emojiClasses.flat().join(" ")}>
          {icon}
        </span>
        <div>
          <h1 class={headlineClasses.join(" ")}>
            {headline}
          </h1>
          {subline}
        </div>
      </Container>
    </div>
  );
}
