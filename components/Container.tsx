import { ComponentChildren, JSX } from "preact";

export interface ContainerProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "auto";
  center?: boolean;
  children: ComponentChildren;
}

export default function Container(props: ContainerProps) {
  const { width = "sm", center, children, ...divProps } = props;
  const widthClass = width && width !== "auto" ? `max-w-screen-${width}` : "";

  return (
    <div
      {...divProps}
      class={`${divProps.class || ""} ${center ? "mx-auto" : ""} ${widthClass}`}
    >
      {children}
    </div>
  );
}
