import { ComponentChildren, JSX } from "preact";

export interface ActionsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
  vertical?: boolean;
}

const baseClasses = [
  "flex",
  "flex-wrap",
  "items-baseline",
  "mb-5",
];

const orientationClasses = {
  horizontal: [
    "gap-5",
  ],
  vertical: [
    "flex-col",
    "gap-2",
  ],
};

export default function Actions(props: ActionsProps) {
  const { vertical } = props;
  const classes = [baseClasses];
  classes.push(orientationClasses[vertical ? "vertical" : "horizontal"]);

  return (
    <div class={`${props.class || ""} ${classes.flat().join(" ")}`}>
      {props.children}
    </div>
  );
}
