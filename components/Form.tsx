import { JSX } from "preact";

import { FormErrors, FormMethod } from "🛠️/forms.ts";

import Alert from "🧱/Alert.tsx";

export const formClasses = [
  "flex",
  "flex-col",
  "gap-7",
];

interface FormProps extends JSX.HTMLAttributes<HTMLFormElement> {
  method: FormMethod;
  formErrors?: FormErrors;
}
export default function Form(props: FormProps) {
  const { method = "get", formErrors, children, ...formProps } = props;
  const usedMethod = method === "get" ? "get" : "post";
  return (
    <>
      {formErrors && <FormAlert formErrors={formErrors} />}
      <form
        method={usedMethod}
        {...formProps}
        class={`${formClasses.join(" ")} ${formProps.class || ""}`}
      >
        {usedMethod !== "get" && (
          <input
            type="hidden"
            name="_method"
            value={method}
          />
        )}
        {children}
      </form>
    </>
  );
}

function FormAlert(props: {
  formErrors: FormErrors;
}) {
  const fields = Object.keys(props.formErrors);
  const title = fields.length > 1 ? "Невалидни полета" : "Невалидно поле";
  return (
    <Alert>
      <p>
        {title}: <strong>{fields.join(", ")}</strong>.
      </p>
    </Alert>
  );
}
