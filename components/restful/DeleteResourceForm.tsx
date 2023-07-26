import { ComponentChildren } from "preact";

import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/restful/meta.ts";
import { Resource, ResourceType } from "🛠️/restful/types.ts";

import Actions from "🧱/Actions.tsx";
import Button from "🧱/Button.tsx";
import Form from "🧱/Form.tsx";
import { Input } from "🧱/FormField.tsx";
import Link from "🧱/Link.tsx";

interface Props<T extends Resource> {
  resourceType: ResourceType;
  resource: T;
  formSubContent?: ComponentChildren;
}

export default function DeleteResourceForm<T extends Resource>(
  props: Props<T>,
) {
  const { resource, resourceType, formSubContent } = props;
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  const confirmValue = resource[meta.confirmDeleteAttr];
  const paths = adminResourcePaths({ resourceType, resource });
  return (
    <Form
      action={paths.base}
      method="delete"
    >
      <Input
        type="text"
        label={meta.texts.deleteConfirmInputLabel}
        placeholder={String(confirmValue)}
        pattern={String(confirmValue)}
        required
      />
      <input
        type="hidden"
        name="id"
        value={resource.id}
      />
      {formSubContent}
      <Actions>
        <Button danger>
          Изтрий
        </Button>
        <Link href={paths.view}>
          Назад
        </Link>
      </Actions>
    </Form>
  );
}
