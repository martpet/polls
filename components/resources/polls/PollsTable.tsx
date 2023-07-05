import { pollDisabledField } from "🛠️/resources/formatters.tsx";
import { sortPolls } from "🛠️/sort.ts";
import { Group, Poll } from "🛠️/types.ts";

import ResourceTable from "🧱/resources/ResourceTable.tsx";

interface Props {
  polls: Poll[];
  group: Group;
}

export default function PollsTable(props: Props) {
  const { polls, group } = props;
  const sortedPolls = polls.toSorted(sortPolls);
  return (
    <ResourceTable
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
