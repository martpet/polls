import { Handlers, PageProps } from "$fresh/server.ts";
import { associateBy } from "$std/collections/associate_by.ts";

import {
  getGroup,
  getPollBySlug,
  listChoicesByPoll,
  listVotesByPoll,
} from "🛠️/db.ts";
import { checkPollActive } from "🛠️/polls.ts";
import { sortChoicesByVotes } from "🛠️/sort.ts";
import { ChoiceAndVotes, Group, Poll } from "🛠️/types.ts";

import { ButtonLink } from "🧱/Button.tsx";
import ChoicesTable from "🧱/ChoicesTable.tsx";
import View from "🧱/View.tsx";

interface Data {
  poll: Poll;
  group: Group | null;
  choicesAndVotes: ChoiceAndVotes[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const poll = await getPollBySlug(ctx.params.slug, {
      consistency: "eventual",
    });
    if (!poll) return ctx.renderNotFound();
    const [group, choices, votes] = await Promise.all([
      poll.group ? getGroup(poll.group, { consistency: "eventual" }) : null,
      listChoicesByPoll(poll.id, { consistency: "eventual" }),
      listVotesByPoll(poll.id, { consistency: "eventual" }),
    ]);
    if (poll.group && !group) {
      throw new Error("Missing poll group");
    }
    const votesByChoice = associateBy(votes, (v) => v.choiceId);

    const choicesAndVotes = choices.map((choice) => ({
      votes: votesByChoice[choice.id]?.votes | 0,
      ...choice,
    })).toSorted(sortChoicesByVotes);
    const res = await ctx.render({
      poll,
      group,
      choicesAndVotes,
    });
    res.headers.set("Cache-Control", "public, max-age=5");
    return res;
  },
};

export default function PollPage({ data }: PageProps<Data>) {
  const { poll, group, choicesAndVotes } = data;
  const isPollActive = checkPollActive(poll, group);
  return (
    <View
      headline={`${group ? `${group.title}: ` : ""}${poll.title}`}
    >
      <ChoicesTable
        poll={poll}
        group={group}
        choices={choicesAndVotes}
      />
      {isPollActive && choicesAndVotes.length && (
        <div class="flex justify-center mt-2">
          <ButtonLink href={`/${poll.slug}/vote`}>
            Гласувайте
          </ButtonLink>
        </div>
      )}
    </View>
  );
}
