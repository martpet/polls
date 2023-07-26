import { Group, Poll } from "🛠️/types.ts";

import ResourceItem from "🧱/restful/ResourceItem.tsx";

import {
  longZonedExpiresAt,
  pollchoicePrefixLabel,
  pollChoiceTitleLabel,
  pollDisabledField,
  pollGroupField,
} from "🛠️/restful/formatters.tsx";

interface Props {
  poll: Poll;
  group: Group | null;
}

export default function PollItem(props: Props) {
  const { poll, group } = props;
  return (
    <ResourceItem
      resourceType="polls"
      resource={poll}
      fields={[
        pollGroupField(group),
        "order",
        longZonedExpiresAt(),
        pollDisabledField(group),
        pollChoiceTitleLabel(group),
        pollchoicePrefixLabel(group),
        "ipCityFilter",
        "slug",
        "createdAt",
      ]}
    />
  );
}
