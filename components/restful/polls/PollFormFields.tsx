import { FORM_ERROR_TIPS, SLUG_PATTERN } from "🛠️/forms.ts";
import { resourcesMeta } from "🛠️/restful/meta.ts";
import { ResourceFormFieldsProps } from "🛠️/restful/types.ts";
import { Group, Poll } from "🛠️/types.ts";

import Fieldset from "🧱/Fieldset.tsx";
import { resourceFormFields } from "🧱/restful/ResourceFormFields.tsx";

interface Props extends ResourceFormFieldsProps<Poll> {
  group: Group | null;
}

export default function PollFormFields(props: Props) {
  const { group } = props;
  const { Input } = resourceFormFields({ resourceType: "polls", ...props });
  return (
    <>
      <Input
        name="id"
        type="hidden"
      />
      {group && (
        <input
          name="group"
          type="hidden"
          value={group.id}
        />
      )}
      <Input
        name="title"
        type="text"
        placeholder={"Анкета 02.04.2023"}
        required
      />
      <Input
        name="subtitle"
        type="text"
      />
      <Input
        name="slug"
        type="text"
        pattern={SLUG_PATTERN}
        title={FORM_ERROR_TIPS["slug"]}
        placeholder="anketa-02-04-2023"
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
            name="ipCityFilter"
            type="text"
            placeholder="Sofia"
          />
          <Input
            name="expiresAt"
            type="datetime-local"
            class="w-fit"
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
