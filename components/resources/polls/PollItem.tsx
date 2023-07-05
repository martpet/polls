import { Group, Poll } from "🛠️/types.ts";

import ResourceItem from "🧱/resources/ResourceItem.tsx";

import {
  longZonedExpiresAt,
  pollchoicePrefixLabel,
  pollChoiceTitleLabel,
  pollDisabledField,
  pollGroupField,
} from "🛠️/resources/formatters.tsx";

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
        "onHome",
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
