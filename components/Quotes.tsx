import { ComponentChildren, JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLElement> {
  children: ComponentChildren;
}

export default function Quotes(props: Props) {
  const { children, ...htmlProps } = props;

  return (
    <span
      {...htmlProps}
      class={`${
        htmlProps.class || ""
      } before:content-[open-quote] after:content-[close-quote]`}
    >
      {children}
    </span>
  );
}
