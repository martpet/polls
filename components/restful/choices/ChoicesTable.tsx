import { mapValues } from "$std/collections/map_values.ts";

import { sortChoices } from "🛠️/sort.ts";
import { Choice, MappedCollectionMaybe, Poll } from "🛠️/types.ts";

import ResourceTable from "🧱/restful/ResourceTable.tsx";

interface Props {
  choices: MappedCollectionMaybe<Choice>;
  poll: Poll;
}

export default function ChoicesTable(props: Props) {
  const { choices, poll } = props;

  const sortedChoices = Array.isArray(choices)
    ? choices.toSorted(sortChoices)
    : mapValues(choices, (it) => it?.toSorted(sortChoices));

  return (
    <ResourceTable
      resourceType="choices"
      resources={sortedChoices}
      fields={["prefix", "title", "addition"]}
      align={{ prefix: "end" }}
      newResourceURLParams={new URLSearchParams({ poll: poll.id })}
    />
  );
}
