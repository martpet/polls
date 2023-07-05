import { longZonedDateFormat } from "🛠️/intl.ts";
import { checkPollActive } from "🛠️/polls.ts";
import { formatResourceValue } from "🛠️/resources/functions.ts";
import { ResourceFieldFormatter } from "🛠️/resources/types.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

export function pollGroupField(
  group: Group | null,
): ResourceFieldFormatter<Poll> {
  return {
    group: () => group?.title,
  };
}

export function choicePollField(
  poll: Poll | null,
): ResourceFieldFormatter<Choice> {
  return {
    poll: () => poll?.title,
  };
}

export function pollDisabledField(
  group: Group | null,
): ResourceFieldFormatter<Poll> {
  return {
    "disabled": (_value, info) => {
      const poll = info?.resource as Poll;
      let result = formatResourceValue({
        resourceType: "polls",
        resource: poll,
        attr: "disabled",
        value: !checkPollActive(poll, group),
      });
      if (group?.disabled) result += " [група]";
      return result;
    },
  };
}

export function pollChoiceTitleLabel(
  group: Group | null,
): ResourceFieldFormatter<Poll> {
  return {
    "choiceTitleLabel": (value, info) => {
      const poll = info?.resource as Poll;
      let result = formatResourceValue({
        resourceType: "polls",
        resource: poll,
        attr: "choiceTitleLabel",
        value: value || group?.choiceTitleLabel || "",
      });
      if (group?.choiceTitleLabel) result += " [група]";
      return result;
    },
  };
}

export function pollchoicePrefixLabel(
  group: Group | null,
): ResourceFieldFormatter<Poll> {
  return {
    "choicePrefixLabel": (value, info) => {
      const poll = info?.resource as Poll;
      let result = formatResourceValue({
        resourceType: "polls",
        resource: poll,
        attr: "choicePrefixLabel",
        value: value || group?.choicePrefixLabel || "",
      });
      if (group?.choicePrefixLabel) result += " [група]";
      return result;
    },
  };
}

export function longZonedExpiresAt(): ResourceFieldFormatter<Poll | Group> {
  return {
    expiresAt: (v) => v && longZonedDateFormat().format(v),
  };
}
