import { Choice, ChoiceAndVotes, Group, Poll } from "🛠️/types.ts";

type Props = {
  poll: Poll;
  group: Group | null;
  isForm?: boolean;
  choices: Choice[] | ChoiceAndVotes[];
};

const classes = {
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

export interface ChoicesTableProps extends Pick<Props, "choices" | "isForm"> {
  hasPrefixes: boolean;
  locale: string;
  pollId: string;
}

export default function ChoicesTableBody(props: ChoicesTableProps) {
  const { choices, isForm, hasPrefixes, locale } = props;
  const hasAdditions = choices.some((c) => c.addition !== "");
  const numberFormat = Intl.NumberFormat(locale);

  return (
    <tbody>
      {choices.map((choice) => (
        <tr
          // @ts-ignore https://github.com/denoland/fresh/issues/1309
          ONClick={isForm && "this.querySelector('input').checked = true"}
          class={isForm ? classes.tr.join(" ") : ""}
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
            class={`
              w-[1%]
              text-right
              font-mono
              font-medium
              ${isForm ? classes.tdRadio.join(" ") : ""}`}
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
              : numberFormat.format((choice as ChoiceAndVotes).votes)}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
