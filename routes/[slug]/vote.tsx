import { Handlers, PageProps } from "$fresh/server.ts";
import { ComponentChildren } from "preact";

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
  removeVote,
} from "🛠️/db.ts";
import { AUTH_PATH } from "🛠️/paths.ts";
import { checkPollActive } from "🛠️/polls.ts";
import { sortChoices } from "🛠️/sort.ts";
import { Choice, Group, Poll, State } from "🛠️/types.ts";
import { canVote } from "🛠️/user.ts";
import checkVoteRequest, { VoteRequestCheck } from "🛠️/vote-check.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import Button from "🧱/Button.tsx";
import ChoicesTable from "🧱/ChoicesTable.tsx";
import Link from "🧱/Link.tsx";
import Quotes from "🧱/Quotes.tsx";
import View from "🧱/View.tsx";
import FailedVoteCheckView from "🧱/views/FailedVoteCheckView.tsx";

type Data =
  | ({
    poll: Poll;
    voteRequestCheck?: never;
  } & (ListData | VoteData))
  | {
    poll: Poll;
    voteRequestCheck: VoteRequestCheck;
  };

interface ListData {
  group: Group | null;
  choices: Choice[];
  choice?: never;
  prevVotedGroupPoll?: never;
  voteResult?: never;
}

type VoteData =
  & { choices?: never; choice: Choice }
  & (
    | {
      voteResult: "success" | "duplicate" | "inactive";
      group?: never;
      prevVotedGroupPoll?: never;
    }
    | {
      voteResult: "nonSameGroupPoll";
      group: Group;
      prevVotedGroupPoll: Poll;
    }
  );

export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    const [user, poll] = await Promise.all([
      getUserBySession(ctx.state.session),
      getPollBySlug(ctx.params.slug, { consistency: "eventual" }),
    ]);
    if (!poll) return ctx.renderNotFound();
    const voteRequestCheck = checkVoteRequest(req, poll);
    if (voteRequestCheck.status !== "good") {
      return ctx.render({ voteRequestCheck, poll });
    }
    if (!user || !canVote(user)) {
      const url = new URL(req.url);
      return new Response(null, {
        headers: { Location: `${AUTH_PATH}?from=${url.pathname}` },
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
    const user = await getUserBySession(ctx.state.session);
    if (!user || !canVote(user)) {
      return new Response(null, { status: user ? 401 : 403 });
    }
    const form = await req.formData();
    const pollId = form.get("poll")?.toString();
    const choiceId = form.get("choice")?.toString();
    if (!pollId) throw new Error("Missing poll id");
    if (!choiceId) throw new Error("Missing choice id");
    const poll = await getPoll(pollId, { consistency: "eventual" });
    if (!poll) throw new Error("Missing poll");
    const voteRequestCheck = checkVoteRequest(req, poll);
    if (voteRequestCheck.status !== "good") {
      return ctx.render({ voteRequestCheck, poll });
    }
    const [group, choice, prevChoiceId] = await Promise.all([
      poll.group ? getGroup(poll.group, { consistency: "eventual" }) : null,
      getChoice(choiceId, { consistency: "eventual" }),
      getUserChoice(user.id, pollId, { consistency: "eventual" }),
    ]);
    if (!choice) throw new Error("Missing choice");
    if (!checkPollActive(poll, group)) {
      return ctx.render({ poll, choice, voteResult: "inactive" });
    }
    if (choiceId === prevChoiceId) {
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
      prevChoiceId ? removeVote([{ pollId, choiceId: prevChoiceId }]) : null,
      addVote({ userId: user.id, pollId, choiceId, groupId: group?.id }),
    ]);
    return ctx.render({ poll, choice, voteResult: "success" });
  },
};

export default function VotePage({ data }: PageProps<Data>) {
  const { poll } = data;
  const backLink = ["Резултати", `/${poll.slug}`] as const;

  if (data.voteRequestCheck) {
    return (
      <FailedVoteCheckView
        requestCheck={data.voteRequestCheck}
        backLink={backLink}
      />
    );
  }

  const { group, choices, voteResult, choice, prevVotedGroupPoll } = data;

  if (voteResult) {
    let blankSlate;
    const changeVoteLine = (
      <div class="mt-2">
        Направили сте грешка? —{" "}
        <Link href={`/${poll.slug}/vote`}>
          Промените гласа си
        </Link>.
      </div>
    );
    if (voteResult === "success") {
      blankSlate = <Success choice={choice} changeVoteLine={changeVoteLine} />;
    } else if (voteResult === "duplicate") {
      blankSlate = (
        <DuplicateChoice choice={choice} changeVoteLine={changeVoteLine} />
      );
    } else if (voteResult === "inactive") {
      blankSlate = <PollInactive />;
    } else if (voteResult === "nonSameGroupPoll") {
      blankSlate = (
        <NotSameGroupPoll
          group={group}
          thisPoll={poll}
          prevPoll={prevVotedGroupPoll}
        />
      );
    }
    return <View blankSlate={blankSlate} backLink={backLink} />;
  }

  return (
    <View
      overline="Гласувайте:"
      headline={`${poll.title}${group ? `, ${group.title}` : ""}`}
      backLink={backLink}
    >
      <form method="POST">
        <input type="hidden" name="poll" value={poll.id} />
        <ChoicesTable
          poll={poll}
          group={group}
          choices={choices.toSorted(sortChoices)}
          isForm
        />
        <div class="flex justify-end mb-5">
          <Button positive>Изпратете гласа си</Button>
        </div>
      </form>
    </View>
  );
}

function Success(
  { choice, changeVoteLine }: {
    choice: Choice;
    changeVoteLine: ComponentChildren;
  },
) {
  return (
    <BlankSlate
      icon="✅"
      headline="Успешно гласуване"
      subline={
        <>
          Вие гласувахте за <Quotes>{choice.title}</Quotes>. {changeVoteLine}
        </>
      }
    />
  );
}

function DuplicateChoice(
  { choice, changeVoteLine }: {
    choice: Choice;
    changeVoteLine: ComponentChildren;
  },
) {
  return (
    <BlankSlate
      icon="❌"
      headline="Неуспешно гласуване"
      subline={
        <>
          Вече сте гласували за <Quotes>{choice.title}</Quotes>.{" "}
          {changeVoteLine}
        </>
      }
    />
  );
}

function NotSameGroupPoll({ group, thisPoll, prevPoll }: {
  group: Group;
  thisPoll: Poll;
  prevPoll: Poll;
}) {
  return (
    <BlankSlate
      icon="❌"
      headline="Неуспешно гласуване"
      subline={
        <>
          Не можете да гласувате на <Quotes>{group.title}</Quotes> в{" "}
          <Quotes>{thisPoll.title}</Quotes>, защото вече сте гласували в{" "}
          <Quotes>{prevPoll.title}</Quotes>.
        </>
      }
    />
  );
}

function PollInactive() {
  return (
    <BlankSlate
      icon="❌"
      headline="Неуспешно гласуване"
      subline="Гласуването е спряно"
    />
  );
}
