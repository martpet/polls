import { JSX } from "preact";

import { formClasses } from "🧱/Form.tsx";

type FieldsetProps = JSX.HTMLAttributes<HTMLFieldSetElement>;

const classes = [
  "[&:not(form>&)]:mb-7",
];

export default function Fieldset(props: FieldsetProps) {
  return (
    <fieldset
      {...props}
      class={`${props.class || ""} ${classes.join(" ")} ${
        formClasses.join(" ")
      }`}
    />
  );
}
