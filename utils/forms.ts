import { Resource } from "🛠️/restful/types.ts";

export const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

type FormField =
  | "required"
  | "string"
  | "number"
  | "boolean"
  | "file"
  | "date"
  | "datestring"
  | "slug";

export type FormFieldError =
  | "uniqueness"
  | Exclude<
    FormField,
    | "string"
    | "boolean"
    | "file"
  >;

export type FormMethod = "get" | "post" | "patch" | "delete";
export type FormFields<T = Resource> = Partial<Record<keyof T, FormField[]>>;
export type FormErrors<T = Resource> = Partial<
  Record<keyof T, FormFieldError[]>
>;
export type FormEntry<T = Resource> = Partial<
  Record<keyof T, FormDataEntryValue | null>
>;

export const FORM_ERROR_TIPS: Record<FormFieldError, string> = {
  required: "Полето е задължително.",
  uniqueness: "Вече има такъв запис.",
  slug: "Може да съдържа латински букви и тирета между тях.",
  number: "Трябва да сърържа само цифри.",
  date: 'Трябва да е във формат "2023-05-24T16:30".',
  datestring: 'Трябва да е във формат "2023-05-24T16:30".',
};

type FieldValidator = (v: FormDataEntryValue | null) => boolean;
const validators: Record<FormField, FieldValidator> = {
  required: (v) => Boolean(v),
  string: (v) => !v || typeof v === "string",
  number: (v) => !v || !isNaN(Number(v)),
  boolean: (v) => !v || v === "on",
  file: (v) => !v || v instanceof File,
  date: (v) => !v || !isNaN(Date.parse(v.toString())),
  datestring: (v) => !v || !isNaN(Date.parse(v.toString())),
  slug: (v) => !v || new RegExp(SLUG_PATTERN).test(v.toString()),
};

export function parseForm<T>(
  formData: FormData,
  formFields: FormFields<T>,
) {
  const formEntry: FormEntry<T> = {};
  const formErrors: FormErrors<T> = {};
  const castedData: Partial<Record<keyof T, unknown>> = {};
  Object.entries(formFields).forEach(
    (entry) => {
      const [key, rules] = entry as [keyof T, FormField[]];
      const entryValue = formData.get(key.toString());
      let castedValue: string | boolean | number | null | Date | File;
      // Store the entry value
      formEntry[key] = entryValue;
      // Validate the entry value
      rules.forEach((rule) => {
        if (!validators[rule](entryValue)) {
          formErrors[key] ??= [];
          formErrors[key]!.push(rule as FormFieldError);
        }
      });
      // Cast the entry value
      if (!Object.keys(formErrors).length) {
        if (entryValue instanceof File) {
          castedValue = entryValue;
        } else if (rules.includes("boolean")) {
          castedValue = entryValue === "on";
        } else if (entryValue === "" || entryValue === null) {
          if (rules.includes("string")) {
            castedValue = "";
          } else {
            castedValue = null;
          }
        } else if (rules.includes("number")) {
          castedValue = Number(entryValue);
        } else if (rules.includes("date")) {
          castedValue = new Date(entryValue);
        } else {
          castedValue = entryValue;
        }
        castedData[key] = castedValue;
      }
    },
  );
  if (Object.keys(formErrors).length) {
    return {
      formErrors,
      formEntry,
    };
  }
  return {
    newData: castedData as T,
    formEntry,
  };
}
