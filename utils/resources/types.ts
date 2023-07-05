import { ComponentChildren } from "preact";

import { FormEntry, FormErrors } from "🛠️/forms.ts";
import { resourcesMeta } from "🛠️/resources/meta.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

export type Resource = Poll | Group | Choice;
export type ResourceType = keyof typeof resourcesMeta;
export type MaybeResourceWithType<T = Resource> = T & { _type?: ResourceType };

export interface ResourceFormFieldsProps<T extends Resource> {
  formEntryOrResource: FormEntry<T> | T | undefined;
  formErrors: FormErrors<T> | undefined;
}

export interface NewResourceProps<T extends Resource> {
  formEntry?: FormEntry<T>;
  formErrors?: FormErrors<T>;
}

export type EditResourceProps<T extends Resource> = {
  resource: T;
  formEntry?: never;
  formErrors?: never;
} | {
  resource?: never;
  formEntry: FormEntry<T>;
  formErrors: FormErrors<T>;
};

export type ResourceFieldSelector<T> = keyof T | ResourceFieldFormatter<T>;

export type ResourceFieldFormatter<T> = Partial<
  {
    [K in keyof T]: (
      value: T[K],
      extra?: {
        resource: Resource;
        req?: Request;
      },
    ) => ComponentChildren;
  }
>;
