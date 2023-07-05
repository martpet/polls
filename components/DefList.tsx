import { ComponentChildren, JSX } from "preact";

const defListClasses = [
  "flex",
  "flex-col",
  "mb-5",
];

const itemWrapClasses = [
  "flex",
  "flex-col",
  "gap-0.5",
];

const dtClasses = [
  "font-semibold",
  "text-slate-900",
  "dark:text-slate-100",
];

const densityClasses = {
  normal: [
    "gap-5",
  ],
  dense: [
    "gap-1.5",
  ],
};

const horizontalClasses = [
  "[&>.item-wrap]:flex-row",
  "[&_dt]:mr-1",
  "[&_dt]:after:content-[':']",
];

export interface DefListProps extends JSX.HTMLAttributes<HTMLDListElement> {
  horizontal?: boolean;
  dense?: boolean;
}

export default function DefList(props: DefListProps) {
  const { horizontal, dense, ...dlProps } = props;
  const classes = [defListClasses];

  classes.push(densityClasses[dense ? "dense" : "normal"]);
  if (horizontal) classes.push(horizontalClasses);

  return (
    <dl
      {...dlProps}
      class={`${classes.flat().join(" ")} ${dlProps.class || ""}`}
    />
  );
}

interface DataItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  term: string;
  children: ComponentChildren;
}

export function Def({ term, children, ...divProps }: DataItemProps) {
  return (
    <div
      {...divProps}
      class={`item-wrap ${itemWrapClasses.join(" ")} ${divProps.class || ""}`}
    >
      <dt class={dtClasses.join(" ")}>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
