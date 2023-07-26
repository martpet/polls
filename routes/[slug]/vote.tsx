import { Handlers, PageProps } from "$fresh/server.ts";

import {
  addVote,
  getChoice,
  getGroup,
  getPoll,
  getPollBySlug,
  getUserBySession,
  getUserChoice,
  getUserVotedGroupPoll,
  listChoicesByPoll,
  removeVotes,
} from "🛠️/db.ts";
import { checkPollActive } from "🛠️/polls.ts";
import { sortChoices } from "🛠️/sort.ts";
import { Choice, Group, Poll, State } from "🛠️/types.ts";
import { canVote } from "🛠️/user.ts";
import checkVoteRequest, { VoteRequestCheck } from "🛠️/vote-check.ts";

import Button from "🧱/Button.tsx";
import ChoicesTable from "🧱/ChoicesTable.tsx";
import View from "🧱/View.tsx";
import VoteCheckView from "🧱/views/VoteCheckView.tsx";
import VoteResultView from "🧱/views/VoteResultView.tsx";

interface Results {
  choices: Choice[];
  choice?: never;
  group: Group | null;
  prevVotedGroupPoll?: never;
  voteResult?: never;
}

type Choices =
  & {
    choices?: never;
    choice: Choice;
  }
  & (
    | {
      group?: never;
      prevVotedGroupPoll?: never;
      voteResult: "success" | "duplicate" | "inactive";
    }
    | {
      group: Group;
      prevVotedGroupPoll: Poll;
      voteResult: "nonSameGroupPoll";
    }
  );

type Data =
  & { poll: Poll }
  & (
    | ((Results | Choices) & { voteCheck?: never })
    | { voteCheck: VoteRequestCheck }
  );

export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    const [user, poll] = await Promise.all([
      getUserBySession(ctx.state.session),
      getPollBySlug(ctx.params.slug, { consistency: "eventual" }),
    ]);
    if (!poll) return ctx.renderNotFound();
    const voteCheck = checkVoteRequest(req, poll);
    if (voteCheck.status !== "ok") {
      return ctx.render({ voteCheck, poll });
    }
    if (!user || !canVote(user)) {
      return new Response(null, {
        headers: {
          Location: new URL(req.url).pathname.replace("/vote", "/auth"),
        },
        status: 302,
      });
    }
    const [group, choices] = await Promise.all([
      poll.group ? getGroup(poll.group, { consistency: "eventual" }) : null,
      listChoicesByPoll(poll.id, { consistency: "eventual" }),
    ]);
    if (poll.group && !group) {
      throw new Error("Missing poll group");
    }
    return ctx.render({ poll, group, choices });
  },

  async POST(req, ctx) {
    const form = await req.formData();
    const pollId = form.get("poll")?.toString();
    const choiceId = form.get("choice")?.toString();
    if (!pollId) throw new Error("Missing poll id");
    if (!choiceId) throw new Error("Missing choice id");
    const [poll, user] = await Promise.all([
      getPoll(pollId, { consistency: "eventual" }),
      getUserBySession(ctx.state.session),
    ]);
    if (!poll) throw new Error("Missing poll");
    if (!user || !canVote(user)) {
      return new Response(null, { status: user ? 401 : 403 });
    }
    const voteCheck = checkVoteRequest(req, poll);
    if (voteCheck.status !== "ok") {
      return ctx.render({ voteCheck, poll });
    }
    const [group, choice, prevUserChoiceId] = await Promise.all([
      poll.group ? getGroup(poll.group, { consistency: "eventual" }) : null,
      getChoice(choiceId, { consistency: "eventual" }),
      getUserChoice(user.id, pollId, { consistency: "eventual" }),
    ]);
    if (!choice) throw new Error("Missing choice");
    if (!checkPollActive(poll, group)) {
      return ctx.render({ poll, choice, voteResult: "inactive" });
    }
    if (choiceId === prevUserChoiceId) {
      return ctx.render({ poll, choice, voteResult: "duplicate" });
    }
    if (group) {
      const prevVotedGroupPollId = await getUserVotedGroupPoll(
        user.id,
        group.id,
        { consistency: "eventual" },
      );
      if (prevVotedGroupPollId && prevVotedGroupPollId !== pollId) {
        const prevVotedGroupPoll = await getPoll(prevVotedGroupPollId, {
          consistency: "eventual",
        });
        if (!prevVotedGroupPoll) throw new Error("prevVotedGroupPoll");
        return ctx.render({
          poll,
          choice,
          group,
          prevVotedGroupPoll,
          voteResult: "nonSameGroupPoll",
        });
      }
    }
    await Promise.all([
      prevUserChoiceId
        ? removeVotes([{ pollId, choiceId: prevUserChoiceId }])
        : null,
      addVote({
        userId: user.id,
        cfray: voteCheck.cfray,
        ip: voteCheck.ip,
        pollId,
        choiceId,
        groupId: group?.id,
        isEdit: Boolean(prevUserChoiceId),
      }),
    ]);
    return ctx.render({ poll, choice, voteResult: "success" });
  },
};

export default function VotePage({ data }: PageProps<Data>) {
  const { poll, voteCheck } = data;
  const backLink = ["Резултати", `/${poll.slug}`] as const;

  if (voteCheck) {
    return (
      <VoteCheckView
        voteCheck={voteCheck}
      />
    );
  }

  const { group, choices, voteResult, choice, prevVotedGroupPoll } = data;

  if (voteResult) {
    return (
      <VoteResultView
        poll={poll}
        choice={choice}
        group={group}
        prevVotedGroupPoll={prevVotedGroupPoll}
        backLink={backLink}
        voteResult={voteResult}
      />
    );
  }

  return (
    <View
      overline="Гласувайте:"
      headline={`${group ? `${group.title}: ` : ""}${poll.title}`}
      backLink={backLink}
    >
      <form method="POST">
        <input
          type="hidden"
          name="poll"
          value={poll.id}
        />
        <ChoicesTable
          poll={poll}
          group={group}
          choices={choices.toSorted(sortChoices)}
          isForm
        />
        <div class="flex justify-center mt-2">
          <Button positive>Изпратете гласа си</Button>
        </div>
      </form>
    </View>
  );
}
