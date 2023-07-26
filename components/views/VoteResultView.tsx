import { ComponentChildren } from "preact";

import { Choice, Group, Poll } from "🛠️/types.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import Link from "🧱/Link.tsx";
import Quotes from "🧱/Quotes.tsx";
import View from "🧱/View.tsx";

interface Props {
  poll: Poll;
  choice: Choice;
  backLink: Readonly<[string, string]>;
  voteResult: "success" | "duplicate" | "inactive" | "nonSameGroupPoll";
  group?: Group;
  prevVotedGroupPoll?: Poll;
}

export default function VoteResultView(props: Props) {
  const {
    choice,
    poll,
    group,
    voteResult,
    prevVotedGroupPoll,
    backLink,
  } = props;

  let blankSlate;

  const changeVoteLine = (
    <div class="mt-2">
      Направили сте грешка?{"  "}
      <Link href={`/${poll.slug}/vote`} class="whitespace-nowrap">
        Променете гласа си
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
  } else if (voteResult === "nonSameGroupPoll" && group && prevVotedGroupPoll) {
    blankSlate = (
      <NotSameGroupPoll
        group={group}
        thisPoll={poll}
        prevPoll={prevVotedGroupPoll}
      />
    );
  }
  return (
    <View
      blankSlate={blankSlate}
      backLink={backLink}
    />
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
