import { getCollator } from "🛠️/intl.ts";
import { isNumeric } from "🛠️/misc.ts";
import { Choice, ChoiceAndVotes } from "🛠️/types.ts";

export const sortPolls = byOrderProp;

export function sortChoices(a: Choice, b: Choice) {
  const prefixIsNumeric = isNumeric(a.prefix) && isNumeric(b.prefix);
  return byPrefixType(a, b) ||
    (prefixIsNumeric ? byPrefixNumeric(a, b) : byPrefixAlpha(a, b)) ||
    byTitleAlpha(a, b);
}

export function sortChoicesByVotes(a: ChoiceAndVotes, b: ChoiceAndVotes) {
  return b.votes - a.votes || sortChoices(a, b);
}

function byPrefixType(a: { prefix: string }, b: { prefix: string }) {
  return isNumeric(a.prefix) && !isNumeric(b.prefix)
    ? -1
    : !isNumeric(a.prefix) && isNumeric(b.prefix)
    ? 1
    : 0;
}

function byPrefixNumeric(a: { prefix: string }, b: { prefix: string }) {
  return parseInt(a.prefix) - parseInt(b.prefix);
}

function byPrefixAlpha(a: { prefix: string }, b: { prefix: string }) {
  const { compare } = getCollator();
  return compare(a.prefix, b.prefix);
}

function byTitleAlpha(a: { title: string }, b: { title: string }) {
  const { compare } = getCollator();
  return compare(a.title, b.title);
}

function byOrderProp(a: { order: number | null }, b: { order: number | null }) {
  return a.order === null && b.order === null
    ? 0
    : a.order === null
    ? 1
    : b.order === null
    ? -1
    : a.order - b.order;
}
