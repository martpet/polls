import { Handlers } from "$fresh/server.ts";
import { associateBy } from "$std/collections/associate_by.ts";

import { listChoicesByPoll, listVotesByPoll } from "🛠️/db.ts";
import { sortChoicesByVotes } from "🛠️/sort.ts";
import { ChoiceAndVotes } from "🛠️/types.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const pollId = ctx.params.id;
    const [choices, votes] = await Promise.all([
      listChoicesByPoll(pollId, { consistency: "eventual" }),
      listVotesByPoll(pollId, { consistency: "eventual" }),
    ]);
    const votesByChoice = associateBy(votes, (v) => v.choiceId);
    const choicesWithVotes = choices.map((choice) => ({
      votes: votesByChoice[choice.id]?.votes | 0,
      title: choice.title,
      prefix: choice.prefix,
      addition: choice.addition,
    })) as ChoiceAndVotes[];
    const sortedChoices = choicesWithVotes.toSorted(sortChoicesByVotes);
    return new Response(
      JSON.stringify({ choices: sortedChoices }),
      {
        headers: {
          "Cache-Control": `public, max-age=9`,
          "Content-Type": "application/json",
        },
      },
    );
  },
};
