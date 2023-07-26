import { adminResourcePaths } from "🛠️/restful/functions.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import Link from "🧱/Link.tsx";

export default function PollsAndGroupsBlankSlate() {
  const pollPaths = adminResourcePaths({ resourceType: "polls" });
  const groupPaths = adminResourcePaths({ resourceType: "groups" });

  return (
    <BlankSlate
      icon="🪄"
      headline="Все още не си създал анкета."
      subline={
        <>
          <Link href={pollPaths.new}>Добави анкета</Link> или{"   "}
          <Link href={groupPaths.new}>създай група</Link>.
        </>
      }
    />
  );
}
