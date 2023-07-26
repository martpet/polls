import { ComponentChildren, JSX } from "preact";

const lineClasses = [
  "block",
  "text-xl",
  "font-bold",
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
      class={`
        ${h1Props.class || ""}
        max-w-screen-md
      `}
    >
      {overline && (
        <span
          class={`
            ${lineClasses.join(" ")}
            mb-3
          `}
        >
          {overline}
        </span>
      )}
      {children}
      {subline && (
        <span
          class={`
            ${lineClasses.join(" ")}
            mt-3
          `}
        >
          {subline}
        </span>
      )}
    </h1>
  );
}
