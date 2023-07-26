import { pollDisabledField } from "🛠️/restful/formatters.tsx";
import { sortPolls } from "🛠️/sort.ts";
import { Group, Poll } from "🛠️/types.ts";

import ResourceTable from "🧱/restful/ResourceTable.tsx";

interface Props {
  polls: Poll[];
  group: Group;
}

export default function PollsTable(props: Props) {
  const { polls, group } = props;
  const sortedPolls = polls.toSorted(sortPolls);
  return (
    <ResourceTable
      fullWidth
      resourceType="polls"
      resources={sortedPolls}
      newResourceURLParams={group
        ? new URLSearchParams({ group: group.id })
        : null}
      fields={[
        "title",
        "order",
        "expiresAt",
        pollDisabledField(group),
      ]}
    />
  );
}
