import { Handlers, PageProps } from "$fresh/server.ts";

import { listGroups, listPollsByGroup } from "🛠️/db.ts";
import {
  addTypeToResources,
  adminResourcePaths,
  resourcePaths,
} from "🛠️/resources/functions.ts";
import { resourcesMeta } from "🛠️/resources/meta.ts";
import { sortPolls } from "🛠️/sort.ts";
import { Group, Poll } from "🛠️/types.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import Link from "🧱/Link.tsx";
import View from "🧱/View.tsx";

interface Data {
  polls: Poll[];
  groups: Group[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const [polls, groups] = await Promise.all([
      listPollsByGroup("", { consistency: "eventual" }),
      listGroups({ consistency: "eventual" }),
    ]);
    const res = await ctx.render({ polls, groups });
    res.headers.set("Cache-Control", "public, max-age=600");
    return res;
  },
};

export default function AllPage({ data }: PageProps<Data>) {
  const { polls, groups } = data;
  const _polls = addTypeToResources({ polls });
  const _groups = addTypeToResources({ groups });
  const sorted = [..._polls, ..._groups].toSorted(sortPolls);
  const pollPaths = adminResourcePaths({ resourceType: "polls" });
  return (
    <View
      headline={resourcesMeta.polls.texts.namePlural}
      blankSlate={!polls.length && !groups.length && (
        <BlankSlate
          headline="Все още не са създадени анкети"
          subline={
            <>
              Ти си администратор?{" "}
              <Link href={pollPaths.new}>Създай анкета</Link>
            </>
          }
          icon="🧑‍💻"
        />
      )}
    >
      <ul>
        {sorted.map((resource) => {
          const { _type, title } = resource;
          const groupPaths = resourcePaths({
            resourceType: "groups",
            resource,
          });
          const pollPath = `/${resource.slug}`;
          const href = _type === "groups" ? groupPaths?.view : pollPath;
          return (
            <li>
              <Link href={href}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </View>
  );
}
