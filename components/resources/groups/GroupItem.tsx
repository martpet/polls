import { longZonedExpiresAt } from "🛠️/resources/formatters.tsx";
import { Group } from "🛠️/types.ts";

import ResourceItem from "🧱/resources/ResourceItem.tsx";

interface Props {
  group: Group;
}

export default function GroupItem(props: Props) {
  const { group } = props;
  return (
    <ResourceItem
      resourceType="groups"
      resource={group}
      fields={[
        longZonedExpiresAt(),
        "disabled",
        "order",
        "slug",
        "choiceTitleLabel",
        "choicePrefixLabel",
        "otherItemsLabel",
        "createdAt",
      ]}
    />
  );
}
