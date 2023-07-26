import { FormEntry, FormErrors } from "🛠️/forms.ts";
import { dateToLocalDateString } from "🛠️/intl.ts";
import { resourcesMeta } from "🛠️/restful/meta.ts";
import { Resource, ResourceType } from "🛠️/restful/types.ts";

import { Input, InputProps, Select, SelectProps } from "🧱/FormField.tsx";

/*
  HOC for form fields with resource data and validations included
*/

interface ResourceConfig<T extends Resource> {
  resourceType: ResourceType;
  formEntryOrResource: FormEntry<T> | T | undefined;
  formErrors: FormErrors<T> | undefined;
}

export function resourceFormFields<T extends Resource>(
  config: ResourceConfig<T>,
) {
  return {
    Input: withResource<T, InputProps>({ Field: Input, config }),
    Select: withResource<T, SelectProps>({ Field: Select, config }),
  };
}

interface WithResourceConfig<T extends Resource> {
  Field: typeof Input | typeof Select;
  config: ResourceConfig<T>;
}

function withResource<T extends Resource, P>(options: WithResourceConfig<T>) {
  const { Field, config } = options;
  const { resourceType, formEntryOrResource, formErrors } = config;

  return function ResourceField(
    props:
      & Omit<P, "name">
      & { name: keyof T },
  ) {
    const { name, ...formFieldProps } = props;
    const { attrLabels } = resourcesMeta[resourceType];

    let value = formEntryOrResource?.[name] as
      | T[keyof T]
      | FormDataEntryValue
      | null
      | undefined;

    value = (value instanceof Date)
      ? dateToLocalDateString(value)
      : value
      ? value.toString()
      : "";

    if ((formFieldProps as InputProps).type === "checkbox") {
      value = undefined;
      (formFieldProps as InputProps).checked = Boolean(
        formEntryOrResource?.[name],
      );
    }

    const resourceProps = {
      name: name as string,
      value,
      formErrors,
      label: attrLabels[name as keyof Resource],
    };

    return <Field {...formFieldProps} {...resourceProps} />;
  };
}
