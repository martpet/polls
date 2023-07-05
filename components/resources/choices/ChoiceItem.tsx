import { Choice } from "🛠️/types.ts";

import ResourceItem from "🧱/resources/ResourceItem.tsx";

interface Props {
  choice: Choice;
}

export default function ChoiceItem(props: Props) {
  const { choice } = props;
  return (
    <ResourceItem
      resourceType="choices"
      resource={choice}
      fields={[
        "prefix",
        "addition",
        "createdAt",
      ]}
    />
  );
}
