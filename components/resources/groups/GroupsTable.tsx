import { Group } from "🛠️/types.ts";

import ResourceTable from "🧱/resources/ResourceTable.tsx";

interface Props {
  groups: Group[];
}

export default function GroupsTable(props: Props) {
  const { groups } = props;
  return (
    <ResourceTable
      resourceType="groups"
      resources={groups}
      fields={[
        "title",
        "expiresAt",
        "disabled",
      ]}
    />
  );
}
