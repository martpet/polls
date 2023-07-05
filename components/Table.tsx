import { ComponentChildren, JSX } from "preact";

export interface TableProps
  extends Omit<JSX.HTMLAttributes<HTMLTableElement>, "wrap"> {
  children: ComponentChildren;
  fullWidth?: boolean;
  wrap?: boolean;
}

const wrapperClasses = [
  "overflow-scroll",
  "mt-2",
];

const baseClasses = [
  "mt-0",
  "[&_td]:px-2.5",
  "[&_th]:px-2.5",
  "[&_td:first-child]:pl-0",
  "[&_td:last-child]:pr-0",
  "[&_th:first-child]:pl-0",
  "[&_th:last-child]:pr-0",
];

export default function Table(props: TableProps) {
  const { fullWidth, wrap, ...tableProps } = props;
  const classes = [...baseClasses];
  if (!fullWidth) classes.push("w-auto");
  if (wrap) classes.push("[&_*]:whitespace-nowrap");

  return (
    <div class={`${wrapperClasses.join(" ")}`}>
      <table
        {...tableProps}
        class={`${classes.flat().join(" ")} ${tableProps.class || ""}`}
      />
    </div>
  );
}
