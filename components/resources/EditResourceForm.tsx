import { ComponentChildren } from "preact";

import { FormEntry } from "🛠️/forms.ts";
import { adminResourcePaths } from "🛠️/resources/functions.ts";
import { Resource, ResourceType } from "🛠️/resources/types.ts";

import Actions from "🧱/Actions.tsx";
import Button from "🧱/Button.tsx";
import Form from "🧱/Form.tsx";
import Link from "🧱/Link.tsx";

interface Props<T extends Resource> {
  resourceType: ResourceType;
  formEntryOrResource: FormEntry<T> | T;
  formFields: ComponentChildren;
}

export default function EditResourceForm<T extends Resource>(props: Props<T>) {
  const { resourceType, formFields, formEntryOrResource } = props;
  const paths = adminResourcePaths({
    resourceType,
    resource: formEntryOrResource,
  });
  return (
    <Form
      action={paths.base}
      method="patch"
    >
      {formFields}
      <Actions>
        <Button positive>
          Запази
        </Button>
        <Link href={paths.view}>
          Назад
        </Link>
      </Actions>
    </Form>
  );
}
