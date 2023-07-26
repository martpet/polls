import { ResourceFormFieldsProps } from "🛠️/restful/types.ts";
import { Choice, Poll } from "🛠️/types.ts";

import { resourceFormFields } from "🧱/restful/ResourceFormFields.tsx";

interface Props extends ResourceFormFieldsProps<Choice> {
  poll: Poll;
}

export default function ChoiceFormFields(props: Props) {
  const { poll } = props;
  const { Input } = resourceFormFields({ resourceType: "choices", ...props });
  return (
    <>
      <Input
        name="id"
        type="hidden"
      />
      <input
        name="poll"
        type="hidden"
        value={poll.id}
      />
      <Input
        name="title"
        type="text"
        required
      />
      <Input
        name="addition"
        type="text"
      />
      <Input
        name="prefix"
        type="text"
        placeholder="1"
      />
    </>
  );
}
