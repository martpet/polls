import { Group, Poll } from "🛠️/types.ts";

export function checkPollActive(poll: Poll, group: Group | null) {
  const now = Date.now();
  if (
    (poll.expiresAt && poll.expiresAt.getTime() < now) ||
    (group?.expiresAt && group.expiresAt.getTime() < now) ||
    poll.disabled ||
    group?.disabled
  ) {
    return false;
  }

  return true;
}
