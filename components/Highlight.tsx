import { JSX } from "preact";

type HighlightProps = JSX.HTMLAttributes<HTMLSpanElement>;

export default function Highlight(props: HighlightProps) {
  const classes = [
    "bg-yellow-100",
    "dark:text-lime-100",
    "dark:bg-lime-800/40",
  ];
  return <span {...props} class={classes.join(" ")} />;
}
