import { ComponentChildren, JSX } from "preact";

import { FORM_ERROR_TIPS, FormErrors } from "🛠️/forms.ts";

export type InputProps = ElementProps<HTMLInputElement>;
export type SelectProps = ElementProps<HTMLSelectElement>;

interface ElementProps<T extends HTMLElement>
  extends Omit<JSX.HTMLAttributes<T>, "label"> {
  label?: ComponentChildren;
  formErrors?: FormErrors;
  noAsterisk?: boolean;
}

export function Input(props: InputProps) {
  return <FormField element="input" {...props} />;
}
export function Select(props: SelectProps) {
  return <FormField element="select" {...props} />;
}

const WAS_VALIDITY_CHECKED = "checked-as-invalid";

const classes = {
  element: [
    "shadow-sm",
    "focus:ring",
    "focus:ring-indigo-200",
    "focus:ring-opacity-50",
    "placeholder:text-gray-300",
    "dark:bg-[#020617]",
    "dark:focus:ring-indigo-800",
    "dark:placeholder:text-slate-700",
    `[&.${WAS_VALIDITY_CHECKED}]:invalid:border-red-400`,
    `[&.${WAS_VALIDITY_CHECKED}]:invalid:focus:ring-red-200`,
  ],
  validState: [
    "border-gray-300",
    "focus:border-indigo-300",
    "dark:border-gray-700",
    "dark:focus:border-slate-600",
  ],
  errorState: [
    "border-red-400",
    "focus:border-red-400",
  ],
  textInput: [
    "rounded-md",
    "disabled:bg-slate-100",
    "dark:disabled:bg-slate-800",
  ],
  checkbox: [
    "rounded",
    "text-indigo-600",
    "disabled:opacity-50",
    "disabled:text-neutral-400",
    "dark:disabled:text-gray-600",
    "dark:disabled:bg-slate-700",
  ],
  wrapper: [
    "flex",
    "gap-1",
    "[&>*:not(input):not(select)]:self-start",
  ],
  wrapperWithTextInput: [
    "flex-col",
  ],
  wrapperWithCheckbox: [
    "flex-row-reverse",
    "items-center",
    "justify-end",
    "gap-2",
  ],
  errorText: [
    "text-red-700",
    "dark:text-red-300",
    "text-sm",
  ],
};

type FormFieldProps =
  | { element: "input" } & InputProps
  | { element: "select" } & SelectProps;

function FormField(props: FormFieldProps) {
  const { label, formErrors, element, noAsterisk, ...elementProps } = props;
  const elementClasses = [classes.element];
  const wrapperClasses = [classes.wrapper];
  const inputID = crypto.randomUUID();
  const errorElementID = crypto.randomUUID();
  const fieldName = props.name as (keyof FormErrors) | undefined;
  const errors = formErrors && fieldName &&
    formErrors[fieldName]?.map((err) => FORM_ERROR_TIPS[err]);
  if (props.type === "checkbox") {
    elementClasses.push(classes.checkbox);
    wrapperClasses.push(classes.wrapperWithCheckbox);
  } else {
    elementClasses.push(classes.textInput);
    wrapperClasses.push(classes.wrapperWithTextInput);
  }
  if (errors) {
    elementClasses.push(classes.errorState);
  } else {
    elementClasses.push(classes.validState);
  }
  let Field;
  if (element === "input") {
    // deno-lint-ignore no-explicit-any
    Field = "input" as any;
  } else {
    // deno-lint-ignore no-explicit-any
    Field = "select" as any;
  }
  if (props.type === "hidden") {
    return <Field {...elementProps} />;
  }
  const finalProps = {
    ...elementProps,
    id: inputID,
    "aria-invalid": Boolean(errors),
    "aria-errormessage": errorElementID,
    class: `${elementClasses.flat().join(" ")} ${props.class || ""}`,
    ONInvalid: `this.classList.add('${WAS_VALIDITY_CHECKED}')`,
  };
  const field = (
    <>
      <Field {...finalProps} />
      {errors && (
        <em id={errorElementID} class={classes.errorText.join(" ")}>
          {errors.join(" ")}
        </em>
      )}
    </>
  );
  if (!label) {
    return field;
  }
  return (
    <div class={`${wrapperClasses.join(" ")}`}>
      <label for={inputID}>
        {label}{" "}
        {elementProps.required && !noAsterisk && (
          <span class="text-red-600">*</span>
        )}
      </label>
      {field}
    </div>
  );
}
