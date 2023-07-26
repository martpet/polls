import { SLUG_PATTERN } from "🛠️/forms.ts";
import { resourcesMeta } from "🛠️/restful/meta.ts";
import { ResourceFormFieldsProps } from "🛠️/restful/types.ts";
import { Group } from "🛠️/types.ts";

import Fieldset from "🧱/Fieldset.tsx";
import { resourceFormFields } from "🧱/restful/ResourceFormFields.tsx";

type Props = ResourceFormFieldsProps<Group>;

export default function GroupFormFields(props: Props) {
  const resourceType = "groups";
  const { Input } = resourceFormFields({ resourceType, ...props });
  return (
    <>
      <Input
        type="hidden"
        name="id"
      />
      <Input
        name="title"
        type="text"
        placeholder="Група 02.10.2019"
        required
      />
      <Input
        name="slug"
        type="text"
        pattern={SLUG_PATTERN}
        placeholder="grupa-2019"
        required
      />
      <details>
        <summary>Допълнителни настройки</summary>
        <Fieldset class="mt-8">
          <Input
            name="choiceTitleLabel"
            type="text"
            placeholder={resourcesMeta.choices.attrLabels.title}
          />
          <Input
            name="choicePrefixLabel"
            type="text"
            placeholder={resourcesMeta.choices.attrLabels.prefix}
          />
          <Input
            name="otherItemsLabel"
            type="text"
            placeholder="Всички"
          />
          <Input
            name="expiresAt"
            type="datetime-local"
            class="w-52"
          />
          <Input
            name="order"
            type="number"
            class="w-20"
          />
          <Input
            name="disabled"
            type="checkbox"
          />
        </Fieldset>
      </details>
    </>
  );
}
