import { ComponentChildren } from "preact";

export interface ProseProps {
  children: ComponentChildren;
}

export default function View(props: ProseProps) {
  return (
    <div class="prose prose-slate dark:prose-invert max-w-none">
      {props.children}
    </div>
  );
}
