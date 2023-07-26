import { addTypeToResources, adminResourcePaths } from "🛠️/restful/functions.ts";
import { resourcesMeta } from "🛠️/restful/meta.ts";
import { sortPolls } from "🛠️/sort.ts";
import { Group, Poll } from "🛠️/types.ts";

import Link from "🧱/Link.tsx";
import ResourceTable from "🧱/restful/ResourceTable.tsx";

interface Props {
  polls: Poll[];
  groups: Group[];
}

export default function PollsAndGroupsTable(props: Props) {
  const { polls, groups } = props;
  const _polls = addTypeToResources({ polls });
  const _groups = addTypeToResources({ groups });
  const sorted = [..._polls, ..._groups].toSorted(sortPolls);
  const groupPaths = adminResourcePaths({ resourceType: "groups" });
  return (
    <>
      <ResourceTable
        resourceType="polls"
        resources={sorted}
        actions={
          <Link href={groupPaths.new}>{resourcesMeta.groups.texts.add}</Link>
        }
        actionsProps={{ vertical: true }}
        fields={[
          "title",
          "order",
          "expiresAt",
          "disabled",
        ]}
      />
    </>
  );
}
