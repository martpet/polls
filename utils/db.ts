import { checkIndexes } from "🛠️/db-indexes.ts";
import { checkIsProd, getHost, getLocale } from "🛠️/host.ts";
import { Choice, Group, OauthSession, Poll, User } from "🛠️/types.ts";

const kv = await Deno.openKv();

function base() {
  return checkIsProd() ? getLocale() : getHost();
}

/*
 * Sessions
 */

export async function getOauthSession(
  session: string,
  options?: Deno.KvListOptions,
): Promise<OauthSession | null> {
  const res = await kv.get<OauthSession>([
    base(),
    "oauth_sessions",
    session,
  ], options);
  if (res.versionstamp === null) return null;
  return res.value;
}

export async function deleteOauthSession(session: string) {
  await kv.delete([base(), "oauth_sessions", session]);
}

export async function setOauthSession(session: string, value: OauthSession) {
  await kv.set([base(), "oauth_sessions", session], value);
}

export async function setUserSession(session: string, userId: string) {
  await kv.set([base(), "user_sessions", session], userId);
}

export async function getUserSession(
  session: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<User["id"]>(
    [base(), "user_sessions", session],
    options,
  );
  return res.value;
}

export async function deleteUserSession(session: string) {
  await kv.delete([base(), "user_sessions", session]);
}

/*
 * Users
 */

export async function setUser(user: User) {
  await kv.set([base(), "users", user.id], user);
}

export async function getUser(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<User>([base(), "users", id], options);
  return res.value;
}

export async function getUserBySession(session: string | undefined) {
  if (!session) return null;
  const userId = await getUserSession(session);
  if (!userId) return null;
  return getUser(userId);
}

export async function deleteUser(id: string) {
  const [choices] = await Promise.all([
    listUserChoices(id),
    kv.delete([base(), "users", id]),
    deleteUserChoices(id),
    deleteUserVotedGroupPoll(id),
  ]);
  await removeVote(choices);
}

/*
 * Polls
 */

export async function setPoll(poll: Poll) {
  const isDefault = poll.onHome;
  delete poll.onHome;
  const primaryKey = [base(), "polls", poll.id];
  const bySlugKey = [base(), "polls_by_slug", poll.slug];
  const byTitleKey = [base(), "polls_by_title", poll.group, poll.title];
  const byGroupKey = [base(), "polls_by_group", poll.group, poll.id];
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

  if (isDefault) {
    op.set([base(), "home_poll"], poll);
  } else {
    const prevDefault = await getHomePoll();
    if (prevDefault?.id === poll.id) {
      op.delete([base(), "home_poll"]);
    }
  }
  await op.commit();
}

export async function deletePoll(id: string) {
  const res = await kv.get<Poll>([base(), "polls", id]);
  if (res.value === null) return;
  const op = kv.atomic();
  op
    .delete([base(), "polls", id])
    .delete([base(), "polls_by_slug", res.value.slug])
    .delete([base(), "polls_by_title", res.value.group, res.value.title])
    .delete([base(), "polls_by_group", res.value.group, id]);

  const defaultPoll = await getHomePoll();
  if (defaultPoll?.id === id) {
    op.delete([base(), "home_poll"]);
  }
  await op.commit();
}

export async function getPoll(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Poll>([base(), "polls", id], options);
  return res.value;
}

export async function getPollBySlug(
  slug: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Poll>([base(), "polls_by_slug", slug], options);
  return res.value;
}

export async function getHomePoll(
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Poll>([base(), "home_poll"], options);
  return res.value;
}

export async function listPolls(
  options?: Deno.KvListOptions,
) {
  const polls = [];
  const iter = kv.list<Poll>({ prefix: [base(), "polls"] }, options);
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
    { prefix: [base(), "polls_by_group", groupId] },
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
  const primaryKey = [base(), "groups", group.id];
  const bySlugKey = [base(), "groups_by_slug", group.slug];
  const byTitleKey = [base(), "groups_by_title", group.title];
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
  const res = await kv.get<Group>([base(), "groups", id]);
  if (res.value === null) return;
  await kv.atomic()
    .delete([base(), "groups", id])
    .delete([base(), "groups_by_slug", res.value.slug])
    .delete([base(), "groups_by_title", res.value.title])
    .commit();
}

export async function getGroup(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Group>([base(), "groups", id], options);
  return res.value;
}

export async function getGroupBySlug(
  slug: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Group>(
    [base(), "groups_by_slug", slug],
    options,
  );
  return res.value;
}

export async function listGroups(
  options?: Deno.KvListOptions,
) {
  const groups = [];
  const iter = kv.list<Group>({ prefix: [base(), "groups"] }, options);
  for await (const { value } of iter) {
    groups.push(value);
  }
  return groups;
}

/*
 * Choices
 */

export async function setChoice(choice: Choice) {
  const primaryKey = [base(), "choices", choice.id];
  const byTitleKey = [
    base(),
    "choices_by_title",
    choice.poll,
    choice.title,
  ];
  const byPollKey = [base(), "choices_by_poll", choice.poll, choice.id];
  const byPrefixKey = [
    base(),
    "choices_by_prefix",
    choice.poll,
    choice.prefix,
  ];
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
  const res = await kv.get<Choice>([base(), "choices", id]);
  if (res.value === null) return;
  await kv.atomic()
    .delete([base(), "choices", id])
    .delete([base(), "choices_by_title", res.value.poll, res.value.title])
    .delete([
      base(),
      "choices_by_prefix",
      res.value.poll,
      res.value.prefix,
    ])
    .delete([base(), "choices_by_poll", res.value.poll, id])
    .commit();
}

export async function getChoice(
  id: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<Choice>([base(), "choices", id], options);
  return res.value;
}

export async function listChoices(
  options?: Deno.KvListOptions,
) {
  const choices = [];
  const iter = kv.list<Choice>({ prefix: [base(), "choices"] }, options);
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
    { prefix: [base(), "choices_by_poll", id] },
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
  pollId,
  choiceId,
  groupId,
}: {
  pollId: string;
  choiceId: string;
  userId: string;
  groupId?: string;
}) {
  const op = kv.atomic()
    .sum([base(), "votes", pollId, choiceId], BigInt(1))
    .set([base(), "user_choice", userId, pollId], choiceId);
  if (groupId) {
    op.set([base(), "user_voted_group_poll", userId, groupId], pollId);
  }
  await op.commit();
}

export async function removeVote(
  choices: { pollId: string; choiceId: string }[],
) {
  const op = kv.atomic();
  choices.forEach(({ pollId, choiceId }) => {
    op.sum([base(), "votes", pollId, choiceId], 0xffffffffffffffffn);
  });
  await op.commit();
}

export async function getUserChoice(
  userId: string,
  pollId: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<string>(
    [base(), "user_choice", userId, pollId],
    options,
  );
  return res.value;
}

export async function listUserChoices(
  userId: string,
  options?: Deno.KvListOptions,
) {
  const iter = await kv.list<string>(
    { prefix: [base(), "user_choice", userId] },
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
  const rows = kv.list({ prefix: [base(), "user_choice", userId] });
  for await (const row of rows) {
    kv.delete(row.key);
  }
}

export async function getUserVotedGroupPoll(
  userId: string,
  groupId: string,
  options?: Deno.KvListOptions,
) {
  const res = await kv.get<string>([
    base(),
    "user_voted_group_poll",
    userId,
    groupId,
  ], options);
  return res.value;
}

export async function deleteUserVotedGroupPoll(userId: string) {
  const rows = kv.list({ prefix: [base(), "user_voted_group_poll", userId] });
  for await (const row of rows) {
    kv.delete(row.key);
  }
}

export async function listVotesByPoll(
  pollId: string,
  options?: Deno.KvListOptions,
) {
  const iter = await kv.list<bigint>(
    { prefix: [base(), "votes", pollId] },
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
 * Other
 */

export function insertPhoneNumber(phoneNumber: string) {
  const key = [base(), "phoneNumbers", phoneNumber];
  return kv.atomic()
    .check({ key, versionstamp: null })
    .set(key, null)
    .commit();
}
