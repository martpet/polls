import { Handlers, PageProps } from "$fresh/server.ts";
import { associateBy } from "$std/collections/associate_by.ts";

import { BACK_LINK_ALL } from "🛠️/constants.ts";
import {
  getGroup,
  getPollBySlug,
  listChoicesByPoll,
  listPolls,
  listVotesByPoll,
} from "🛠️/db.ts";
import { checkPollActive } from "🛠️/polls.ts";
import { resourcePaths } from "🛠️/resources/functions.ts";
import { sortChoicesByVotes } from "🛠️/sort.ts";
import { ChoiceWithVotes, Group, Poll } from "🛠️/types.ts";

import { ButtonLink } from "🧱/Button.tsx";
import ChoicesTable from "🧱/ChoicesTable.tsx";
import View from "🧱/View.tsx";

interface Data {
  poll: Poll;
  group: Group | null;
  choicesWithVotes: ChoiceWithVotes[];
  hasMorePolls: boolean;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const poll = await getPollBySlug(ctx.params.slug, {
      consistency: "eventual",
    });
    if (!poll) return ctx.renderNotFound();
    const [group, choices, votes, polls] = await Promise.all([
      poll.group ? getGroup(poll.group, { consistency: "eventual" }) : null,
      listChoicesByPoll(poll.id, { consistency: "eventual" }),
      listVotesByPoll(poll.id, { consistency: "eventual" }),
      listPolls({ limit: 2, consistency: "eventual" }),
    ]);
    if (poll.group && !group) {
      throw new Error("Missing poll group");
    }
    const votesByChoice = associateBy(votes, (v) => v.choiceId);
    const choicesWithVotes = choices.map((choice) => ({
      votes: votesByChoice[choice.id]?.votes | 0,
      ...choice,
    }));
    const hasMorePolls = polls.length > 1;
    const res = await ctx.render({
      poll,
      group,
      choicesWithVotes,
      hasMorePolls,
    });
    res.headers.set("Cache-Control", "public, max-age=5");
    return res;
  },
};

export default function PollPage({ data }: PageProps<Data>) {
  const { poll, group, choicesWithVotes, hasMorePolls } = data;
  const sortedChoices = choicesWithVotes.toSorted(sortChoicesByVotes);
  const groupPaths = resourcePaths({ resourceType: "groups", resource: group });

  const backLink = group
    ? [group.otherItemsLabel || group.title, groupPaths.view!] as const
    : hasMorePolls
    ? BACK_LINK_ALL
    : null;

  const voteButton = (
    <ButtonLink small href={`/${poll.slug}/vote`}>
      Гласувайте
    </ButtonLink>
  );

  return (
    <View
      headline={poll.title}
      subline={group?.title}
      docTitle={`${group ? `${group.title}: ` : ""}${poll.title}`}
      // backLink={backLink}
      headerContent={checkPollActive(poll, group) && voteButton}
    >
      <ChoicesTable
        poll={poll}
        group={group}
        choices={sortedChoices}
      />
    </View>
  );
}
