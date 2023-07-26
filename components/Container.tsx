import { ComponentChildren, JSX } from "preact";

export interface ContainerProps extends JSX.HTMLAttributes<HTMLElement> {
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "auto";
  center?: boolean;
  children: ComponentChildren;
}

export default function Container(props: ContainerProps) {
  const { width = "sm", center, children, ...elementProps } = props;
  const widthClass = width && width !== "auto" ? `max-w-screen-${width}` : "";

  return (
    <section
      {...elementProps}
      class={`${elementProps.class || ""} ${
        center ? "mx-auto" : ""
      } ${widthClass}`}
    >
      {children}
    </section>
  );
}
