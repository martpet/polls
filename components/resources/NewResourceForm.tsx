import { ComponentChildren } from "preact";
import { adminResourcePaths } from "🛠️/resources/functions.ts";
import { ResourceType } from "🛠️/resources/types.ts";

import Actions from "🧱/Actions.tsx";
import Button from "🧱/Button.tsx";
import Form from "🧱/Form.tsx";
import Link from "🧱/Link.tsx";

interface Props {
  resourceType: ResourceType;
  formFields: ComponentChildren;
  backLink: string | undefined;
}

export default function NewResourceForm(props: Props) {
  const { resourceType, formFields, backLink } = props;
  const paths = adminResourcePaths({ resourceType });
  return (
    <Form
      action={paths.base}
      method="post"
    >
      {formFields}
      <Actions>
        <Button positive>
          Създай
        </Button>
        <Link href={backLink || paths.base}>
          Назад
        </Link>
      </Actions>
    </Form>
  );
}
