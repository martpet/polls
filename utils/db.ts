import checkIndexes from "🛠️/db-index-check.ts";
import { checkProd, getHost, getHostname } from "🛠️/host.ts";
import { roundDownTo5Minutes } from "🛠️/misc.ts";
import { Choice, Group, OauthSession, Poll, User } from "🛠️/types.ts";

const kv = await Deno.openKv();

function kvkey(...args: Deno.KvKey) {
  const base = checkProd() ? getHost().locale : getHostname();
  return [base, ...args];
}

/*
 * Sessions
 */

export async function getOauthSession(
  session: string,
  options?: Deno.KvListOptions,
): Promise<OauthSession | null> {
  const res = await kv.get<OauthSession>(
    kvkey("oauth_sessions", session),
    options,
  );
  if (res.versionstamp === null) return null;
  return res.value;
}

export async function deleteOauthSession(session: string) {
  await kv.delete(kvkey("oauth_sessions", session));
}

export async function setOauthSession(session: string, value: OauthSession) {
  await kv.set(kvkey("oauth_sessions", session), value);
}

export async function setUserSession(session: string, userId: string) {
  await kv.set(kvkey("user_sessions", session), userId);
}

export async function getUserSession(
  session: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<User["id"]>(
    kvkey("user_sessions", session),
    options,
  );
  return res.value;
}

export async function deleteUserSession(session: string) {
  await kv.delete(kvkey("user_sessions", session));
}

/*
 * Users
 */

export async function setUser(user: User) {
  await kv.set(kvkey("users", user.id), user);
}

export async function getUser(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<User>(kvkey("users", id), options);
  return res.value;
}

export async function getUserBySession(session: string | undefined) {
  if (!session) return null;
  const userId = await getUserSession(session);
  if (!userId) return null;
  return getUser(userId);
}

export async function deleteUser(id: string) {
  const [userVotes] = await Promise.all([
    listUserVotes(id),
    deleteUserChoices(id),
    deleteUserVotedGroupPoll(id),
  ]);
  await removeVotes(userVotes);
}

export function insertPhoneNumber(phoneNumber: string) {
  const key = kvkey("phones", phoneNumber);
  return kv.atomic()
    .check({ key, versionstamp: null })
    .set(key, new Date())
    .commit();
}

export async function deletePhoneNumber(phoneNumber: string) {
  await kv.delete(kvkey("phones", phoneNumber));
}

/*
 * Polls
 */

export async function setPoll(poll: Poll) {
  const primaryKey = kvkey("polls", poll.id);
  const bySlugKey = kvkey("polls_by_slug", poll.slug);
  const byTitleKey = kvkey("polls_by_title", poll.group, poll.title);
  const byGroupKey = kvkey("polls_by_group", poll.group, poll.id);
  const { uniqueFieldsErrors, keysForRemoval } = await checkIndexes<Poll>(kv, {
    primaryKey,
    uniqueIndexes: { slug: bySlugKey, title: byTitleKey },
    nonUniqueIndexes: { group: byGroupKey },
  });
  if (uniqueFieldsErrors) {
    return uniqueFieldsErrors;
  }
  const op = kv.atomic();
  if (keysForRemoval) {
    keysForRemoval.forEach((key) => op.delete(key));
  }
  op
    .set(primaryKey, poll)
    .set(bySlugKey, poll)
    .set(byTitleKey, poll)
    .set(byGroupKey, poll);
  await op.commit();
}

export async function deletePoll(id: string) {
  const res = await kv.get<Poll>(kvkey("polls", id));
  if (res.value === null) return;
  const op = kv.atomic();
  op
    .delete(kvkey("polls", id))
    .delete(kvkey("polls_by_slug", res.value.slug))
    .delete(kvkey("polls_by_title", res.value.group, res.value.title))
    .delete(kvkey("polls_by_group", res.value.group, id));

  await op.commit();
}

export async function getPoll(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Poll>(kvkey("polls", id), options);
  return res.value;
}

export async function getPollBySlug(
  slug: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Poll>(kvkey("polls_by_slug", slug), options);
  return res.value;
}

export async function listPolls(
  options?: Deno.KvListOptions,
) {
  const polls = [];
  const iter = kv.list<Poll>({ prefix: kvkey("polls") }, options);
  for await (const { value } of iter) {
    polls.push(value);
  }
  return polls;
}

export async function listPollsByGroup(
  groupId: string,
  options?: Deno.KvListOptions,
) {
  const polls = [];
  const iter = kv.list<Poll>(
    { prefix: kvkey("polls_by_group", groupId) },
    options,
  );
  for await (const { value } of iter) {
    polls.push(value);
  }
  return polls;
}

/*
 * Groups
 */

export async function setGroup(group: Group) {
  const primaryKey = kvkey("groups", group.id);
  const bySlugKey = kvkey("groups_by_slug", group.slug);
  const byTitleKey = kvkey("groups_by_title", group.title);
  const { uniqueFieldsErrors, keysForRemoval } = await checkIndexes(kv, {
    primaryKey,
    uniqueIndexes: { slug: bySlugKey, title: byTitleKey },
  });
  if (uniqueFieldsErrors) {
    return uniqueFieldsErrors;
  }
  const op = kv.atomic();
  if (keysForRemoval) {
    keysForRemoval.forEach((key) => op.delete(key));
  }
  op
    .set(primaryKey, group)
    .set(bySlugKey, group)
    .set(byTitleKey, group);
  await op.commit();
}

export async function deleteGroup(id: string) {
  const res = await kv.get<Group>(kvkey("groups", id));
  if (res.value === null) return;
  await kv.atomic()
    .delete(kvkey("groups", id))
    .delete(kvkey("groups_by_slug", res.value.slug))
    .delete(kvkey("groups_by_title", res.value.title))
    .commit();
}

export async function getGroup(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Group>(kvkey("groups", id), options);
  return res.value;
}

export async function getGroupBySlug(
  slug: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Group>(
    kvkey("groups_by_slug", slug),
    options,
  );
  return res.value;
}

export async function listGroups(
  options?: Deno.KvListOptions,
) {
  const groups = [];
  const iter = kv.list<Group>({ prefix: kvkey("groups") }, options);
  for await (const { value } of iter) {
    groups.push(value);
  }
  return groups;
}

/*
 * Choices
 */

export async function setChoice(choice: Choice) {
  const primaryKey = kvkey("choices", choice.id);
  const byTitleKey = kvkey("choices_by_title", choice.poll, choice.title);
  const byPollKey = kvkey("choices_by_poll", choice.poll, choice.id);
  const byPrefixKey = kvkey("choices_by_prefix", choice.poll, choice.prefix);
  const { uniqueFieldsErrors, keysForRemoval } = await checkIndexes<Choice>(
    kv,
    {
      primaryKey,
      uniqueIndexes: { title: byTitleKey },
      nonUniqueIndexes: { poll: byPollKey, prefix: byPrefixKey },
    },
  );
  if (uniqueFieldsErrors) {
    return uniqueFieldsErrors;
  }
  const op = kv.atomic();
  if (keysForRemoval) {
    keysForRemoval.forEach((key) => op.delete(key));
  }
  op
    .set(primaryKey, choice)
    .set(byTitleKey, choice)
    .set(byPrefixKey, choice)
    .set(byPollKey, choice);
  await op.commit();
}

export async function deleteChoice(id: string) {
  const res = await kv.get<Choice>(kvkey("choices", id));
  if (res.value === null) return;
  await kv.atomic()
    .delete(kvkey("choices", id))
    .delete(kvkey("choices_by_title", res.value.poll, res.value.title))
    .delete(kvkey("choices_by_prefix", res.value.poll, res.value.prefix))
    .delete(kvkey("choices_by_poll", res.value.poll, id))
    .commit();
}

export async function getChoice(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Choice>(kvkey("choices", id), options);
  return res.value;
}

export async function listChoices(
  options?: Deno.KvListOptions,
) {
  const choices = [];
  const iter = kv.list<Choice>({ prefix: kvkey("choices") }, options);
  for await (const { value } of iter) {
    choices.push(value);
  }
  return choices;
}

export async function listChoicesByPoll(
  id: string,
  options?: Deno.KvListOptions,
) {
  const choices = [];
  const iter = kv.list<Choice>(
    { prefix: kvkey("choices_by_poll", id) },
    options,
  );
  for await (const { value } of iter) {
    choices.push(value);
  }
  return choices;
}

/*
 * Votes
 */

export async function addVote({
  userId,
  cfray,
  ip,
  pollId,
  choiceId,
  groupId,
  isEdit,
}: {
  userId: string;
  cfray: string;
  ip: string;
  pollId: string;
  choiceId: string;
  groupId?: string;
  isEdit: boolean;
}) {
  const date = new Date();
  const dateISO = date.toISOString();
  const dateRounded = new Date(roundDownTo5Minutes(date.getTime()));
  const dateRoundedISO = dateRounded.toISOString();

  const op = kv.atomic()
    .sum(kvkey("votes", pollId, choiceId), BigInt(1))
    .set(kvkey("user_choices", userId, pollId), choiceId)
    .set(kvkey("choice_log", choiceId, dateISO), { cfray, ip, userId, isEdit })
    .set(kvkey("choice_trend", choiceId, dateRoundedISO), BigInt(1))
    .set(kvkey("poll_trend", pollId, dateRoundedISO), BigInt(1));

  if (groupId) {
    op.set(kvkey("user_voted_group_poll", userId, groupId), pollId);
  }
  await op.commit();
}

export async function removeVotes(
  votes: { pollId: string; choiceId: string }[],
) {
  const op = kv.atomic();
  votes.forEach(({ pollId, choiceId }) => {
    op.sum(kvkey("votes", pollId, choiceId), 0xffffffffffffffffn);
  });
  await op.commit();
}

export async function getUserChoice(
  userId: string,
  pollId: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<string>(
    kvkey("user_choices", userId, pollId),
    options,
  );
  return res.value;
}

export async function listUserVotes(
  userId: string,
  options?: Deno.KvListOptions,
) {
  const iter = await kv.list<string>(
    { prefix: kvkey("user_choices", userId) },
    options,
  );
  const entries = [];
  for await (const { key, value } of iter) {
    const pollId = key.at(-1) as string;
    entries.push({ pollId, choiceId: value });
  }
  return entries;
}

export async function deleteUserChoices(userId: string) {
  const rows = kv.list({ prefix: kvkey("user_choices", userId) });
  for await (const row of rows) {
    kv.delete(row.key);
  }
}

export async function getUserVotedGroupPoll(
  userId: string,
  groupId: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<string>(
    kvkey("user_voted_group_poll", userId, groupId),
    options,
  );
  return res.value;
}

export async function deleteUserVotedGroupPoll(userId: string) {
  const rows = kv.list({ prefix: kvkey("user_voted_group_poll", userId) });
  for await (const row of rows) {
    kv.delete(row.key);
  }
}

export async function listVotesByPoll(
  pollId: string,
  options?: Deno.KvListOptions,
) {
  const iter = await kv.list<bigint>(
    { prefix: kvkey("votes", pollId) },
    options,
  );
  const entries = [];
  for await (const { key, value } of iter) {
    const choiceId = key.at(-1) as string;
    entries.push({ choiceId, votes: Number(value) });
  }
  return entries;
}

/*
 * Admin
 */

export async function resetDB() {
  const rows = kv.list({ prefix: kvkey() });
  for await (const row of rows) {
    kv.delete(row.key);
  }
}
