import { ComponentChildren, JSX } from "preact";

const headlineClasses = [
  "max-w-screen-md",
];

const lineClasses = [
  "block",
  "font-semibold",
  "text-xl",
];

interface HeadingProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  children: ComponentChildren;
  subline?: ComponentChildren;
  overline?: ComponentChildren;
}

export default function Heading(props: HeadingProps) {
  const { subline, overline, children, ...h1Props } = props;

  return (
    <h1
      {...h1Props}
      class={`${h1Props.class || ""} ${headlineClasses.join(" ")}`}
    >
      {overline && (
        <span class={`mb-1 ${lineClasses.join(" ")}`}>
          {overline}
        </span>
      )}
      {children}
      {subline && (
        <span class={`mt-3 ${lineClasses.join(" ")}`}>
          {subline}
        </span>
      )}
    </h1>
  );
}
