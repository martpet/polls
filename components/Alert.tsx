import { ComponentChildren, JSX } from "preact";

import Link from "🧱/Link.tsx";

const commonClasses = [
  "not-prose",
  "rounded",
  "my-8",
  "p-4",
  "text-xl",
  "leading-relaxed",
  "border-1",
  "[&>a]:font-medium",
  "[&>a]:underline",
  "[&>a]:text-blue-700",
  "dark:text-slate-100",
  "dark:[&>a]:text-yellow-300",
];

const variantClasses = {
  danger: [
    "bg-pink-100",
    "border-red-400",
    "dark:bg-[#450A0A]",
    "dark:border-red-900",
  ],
  neutral: [
    "bg-neutral-100",
    "border-neutral-200",
    "dark:bg-slate-800",
    "dark:border-slate-700",
  ],
  info: [
    "bg-sky-50",
    "border-sky-200",
    "dark:bg-[#082f49]",
    "dark:border-sky-900",
  ],
};

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
  variant?: "danger" | "info" | "neutral";
}

export default function Alert(props: Props) {
  const { variant = "danger", children, ...divProps } = props;

  const classes = [
    commonClasses,
    variantClasses[variant],
  ];

  return (
    <div
      {...divProps}
      class={`${divProps.class || ""} ${classes.flat().join(" ")}`}
    >
      {children}
    </div>
  );
}

type AlertActionLinkProps = JSX.HTMLAttributes<HTMLAnchorElement> & {
  children: ComponentChildren;
};

export function AlertActionLink(props: AlertActionLinkProps) {
  return (
    <div class="mt-2">
      <span aria-hidden="true">➡</span>{" "}
      <Link {...props} class={`${props.class || ""} underline`} />
    </div>
  );
}
