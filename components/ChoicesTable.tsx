import { getLocale } from "🛠️/host.ts";
import { getNumberFormat } from "🛠️/intl.ts";
import { checkPollActive } from "🛠️/polls.ts";
import { resourcesMeta } from "🛠️/resources/meta.ts";
import { Choice, ChoiceWithVotes, Group, Poll } from "🛠️/types.ts";

import Table from "🧱/Table.tsx";

import ChoicesTableBodyIsland from "🏝️/ChoicesTableBodyIsland.tsx";

type Props = {
  poll: Poll;
  group: Group | null;
  isForm?: boolean;
  choices: Choice[] | ChoiceWithVotes[];
};

const formClasses = {
  table: [
    "[&:has(:checked)_.radio-cell]:bg-transparent",
    "[&.isForm_tr>*:first-child]:pl-1",
  ],
  tr: [
    "cursor-pointer",
    "hover:bg-gray-100",
    "dark:hover:bg-slate-800",
    "[&:has(input:checked)]:bg-slate-200",
    "[&:has(input:checked)]:dark:bg-slate-700",
  ],
  tdRadio: [
    "radio-cell",
    "align-middle",
    "!px-3",
    "bg-yellow-100",
    "dark:bg-slate-800",
  ],
};

export default function ChoicesTable(props: Props) {
  const { choices, poll, group, isForm } = props;
  const hasPrefixes = choices.some((c) => c.prefix !== "");
  const isActive = checkPollActive(poll, group);

  const TableBody = (isActive && !isForm)
    ? ChoicesTableBodyIsland
    : ChoicesTableBody;

  const prefixLabel = group?.choicePrefixLabel ||
    poll.choicePrefixLabel ||
    resourcesMeta.choices.attrLabels.prefix;

  const titleLabel = group?.choiceTitleLabel || poll.choiceTitleLabel ||
    resourcesMeta.choices.attrLabels.title;

  return (
    <Table
      fullWidth
      class={`${isForm ? "isForm" : ""} ${formClasses.table.join(" ")}`}
    >
      <thead>
        <tr>
          {hasPrefixes && <th class="text-right">{prefixLabel}</th>}
          <th>{titleLabel}</th>
          <th class="text-right">{!isForm && "Гласове"}</th>
        </tr>
      </thead>
      <TableBody
        choices={choices}
        isForm={isForm}
        hasPrefixes={hasPrefixes}
        locale={getLocale()}
        pollId={poll.id}
      />
    </Table>
  );
}

export interface ChoicesTableBodyProps
  extends Pick<Props, "choices" | "isForm"> {
  hasPrefixes: boolean;
  locale: string;
  pollId: string;
}

export function ChoicesTableBody(props: ChoicesTableBodyProps) {
  const { choices, isForm, hasPrefixes, locale } = props;
  const hasAdditions = choices.some((c) => c.addition !== "");
  const numberFormat = getNumberFormat({ locale });

  return (
    <tbody>
      {choices.map((choice) => (
        <tr
          class={isForm ? formClasses.tr.join(" ") : ""}
          // @ts-ignore https://github.com/denoland/fresh/issues/1309
          ONClick={isForm && "this.querySelector('input').checked = true"}
        >
          {hasPrefixes && (
            <td
              class={`text-right whitespace-nowrap ${
                hasAdditions ? "font-semibold" : ""
              }`}
            >
              {choice.prefix}
            </td>
          )}
          <td>
            {!hasAdditions ? choice.title : (
              <>
                <strong class="text-inherit">{choice.title}</strong>
                <br /> {choice.addition}
              </>
            )}
          </td>
          <td
            class={`text-right font-mono font-medium w-[1%] ${
              isForm ? formClasses.tdRadio.join(" ") : ""
            }`}
          >
            {isForm
              ? (
                <input
                  type="radio"
                  value={choice.id}
                  name="choice"
                  class="cursor-pointer"
                  required
                />
              )
              : numberFormat.format((choice as ChoiceWithVotes).votes)}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
