import { JSX } from "preact";

type ButtonProps = CommonProps & JSX.HTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = CommonProps & JSX.HTMLAttributes<HTMLAnchorElement>;

type VariantProps =
  | {
    positive?: true;
    danger?: never;
  }
  | {
    positive?: never;
    danger?: true;
  };

type CommonProps = VariantProps & {
  small?: boolean;
};

const commonClasses = [
  "inline-block",
  "no-underline",
  "rounded-full",
  "font-semibold",
  "border-4",
  "border-double",
  "dark:border-1",
];

const sizeClases = {
  small: [
    "text-base",
    "px-4",
    "py-1",
  ],
  base: [
    "text-lg",
    "px-6",
    "py-1.5",
    "dark:py-2",
  ],
};

const variantClasses = {
  normal: [
    "text-slate-100",
    "bg-slate-800",
    "border-slate-800",
    "hover:bg-black",
    "hover:border-black",
    "active:bg-slate-800",
    "active:border-slate-300",
    "dark:bg-slate-700",
    "dark:border-slate-600",
    "dark:hover:bg-slate-700",
    "dark:hover:border-slate-500",
    "dark:active:bg-slate-800",
    "dark:active:border-slate-500",
  ],
  positive: [
    "text-white",
    "bg-emerald-800",
    "border-emerald-800",
    "hover:bg-emerald-900",
    "hover:border-emerald-900",
    "active:bg-emerald-800",
    "active:border-emerald-100",
    "dark:bg-emerald-700",
    "dark:border-emerald-600",
    "dark:hover:bg-emerald-700",
    "dark:hover:border-emerald-500",
    "dark:active:bg-emerald-800",
    "dark:active:border-emerald-500",
  ],
  danger: [
    "text-white",
    "bg-red-800",
    "border-red-800",
    "hover:bg-red-900",
    "hover:border-red-900",
    "active:bg-red-800",
    "active:border-red-100",
    "dark:bg-red-700",
    "dark:border-red-600",
    "dark:hover:bg-red-700",
    "dark:hover:border-red-500",
    "dark:active:bg-red-800",
    "dark:active:border-red-500",
  ],
};

export default function Button(props: ButtonProps) {
  return <button {...makeProps(props)} />;
}

export function ButtonLink(props: ButtonLinkProps) {
  return <a {...makeProps(props)} />;
}

function makeProps<T extends ButtonProps | ButtonLinkProps>(props: T) {
  const { positive, danger, small, ...finalProps } = props;
  const classes = [commonClasses];
  classes.push(
    variantClasses[positive ? "positive" : danger ? "danger" : "normal"],
  );
  classes.push(sizeClases[small ? "small" : "base"]);
  finalProps.class = `${props.class || ""} ${classes.flat().join(" ")}`;
  return finalProps;
}
