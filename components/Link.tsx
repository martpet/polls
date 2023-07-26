import { JSX } from "preact";
import { LINK_COLOR } from "🛠️/constants.ts";

interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  danger?: boolean;
  back?: boolean;
}

const commonClasses = [
  "no-underline",
  "[&:not(:has(.back-arrow))]:hover:underline",
];

const typeClasses = {
  normal: [
    LINK_COLOR,
    "dark:text-blue-400",
  ],
  danger: [
    "text-red-600",
    "dark:text-red-400",
  ],
};

export default function Link({ back, children, ...props }: LinkProps) {
  const classes = [commonClasses];
  if (props.danger) {
    classes.push(typeClasses.danger);
  } else {
    classes.push(typeClasses.normal);
  }

  return (
    <a
      {...props}
      class={`${props.class || ""} ${classes.flat().join(" ")}`}
    >
      {back && (
        <span aria-hidden="true" class="back-arrow mr-1.5">
          ⏴
        </span>
      )}
      {back
        ? (
          <span class="hover:underline">
            {children}
          </span>
        )
        : children}
    </a>
  );
}
