import { getHost } from "🛠️/host.ts";
import { resourcesMeta } from "🛠️/restful/meta.ts";
import { Choice, ChoiceAndVotes, Group, Poll } from "🛠️/types.ts";

import ChoicesTableBody from "🧱/ChoicesTableBody.tsx";
import Table from "🧱/Table.tsx";

const classes = [
  "[&:has(:checked)_.radio-cell]:bg-transparent",
  "[&.isForm_tr>*:first-child]:pl-1",
];

type Props = {
  poll: Poll;
  group: Group | null;
  isForm?: boolean;
  choices: Choice[] | ChoiceAndVotes[];
};

export default function ChoicesTable(props: Props) {
  const { choices, poll, group, isForm } = props;
  const hasPrefixes = choices.some((c) => c.prefix !== "");

  const prefixLabel = group?.choicePrefixLabel ||
    poll.choicePrefixLabel ||
    resourcesMeta.choices.attrLabels.prefix;

  const titleLabel = group?.choiceTitleLabel || poll.choiceTitleLabel ||
    resourcesMeta.choices.attrLabels.title;

  if (isForm) {
    classes.push("isForm");
  }

  return (
    <>
      {poll.subtitle && <p class="lead mb-12">{poll.subtitle}</p>}
      <Table fullWidth class={classes.join(" ")}>
        <thead>
          <tr>
            {hasPrefixes && <th class="text-right">{prefixLabel}</th>}
            <th class="w-full">{titleLabel}</th>
            <th class="text-right">{!isForm && "Гласове"}</th>
          </tr>
        </thead>
        <ChoicesTableBody
          choices={choices}
          isForm={isForm}
          hasPrefixes={hasPrefixes}
          locale={getHost().locale}
          pollId={poll.id}
        />
      </Table>
    </>
  );
}
