import { Handlers, PageProps } from "$fresh/server.ts";
import { groupBy } from "$std/collections/group_by.ts";
import { partition } from "$std/collections/partition.ts";

import { listGroups, listPolls } from "🛠️/db.ts";
import { adminResourcePaths } from "🛠️/restful/functions.ts";
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
      listPolls({ consistency: "eventual" }),
      listGroups({ consistency: "eventual" }),
    ]);
    const res = await ctx.render({ polls, groups });
    res.headers.set("Cache-Control", "public, max-age=60");
    return res;
  },
};

export default function HomePage({ data, url }: PageProps<Data>) {
  const { polls, groups } = data;
  return (
    <View
      center={false}
      blankSlate={!polls.length && !groups.length && <AdminIntro />}
      isLogoLink={false}
      class="!pt-6 !pb-4"
    >
      <PollsList
        polls={polls}
        groups={groups}
      />
    </View>
  );
}

function PollsList({ polls, groups }: { polls: Poll[]; groups: Group[] }) {
  const [pollsWithGroup, pollsNoGroup] = partition(polls, (p) => !!p.group);
  const pollsByGroup = groupBy(pollsWithGroup, (p) => p.group);
  const resources = [...pollsNoGroup, ...groups].toSorted(sortPolls);
  return (
    <ul>
      {resources.map((resource) => {
        const isGroup = groups.includes(resource as Group);
        return (
          <li class="mb-4">
            {!isGroup && (
              <Link href={`/${resource.slug}`}>{resource.title}</Link>
            )}
            {isGroup && (
              <>
                {resource.title}
                {": "}
                {pollsByGroup[resource.id]?.toSorted(sortPolls).map((
                  p,
                  index,
                ) => (
                  <>
                    {index !== 0 && ", "}
                    <Link text-slate-500 href={`/${p.slug}`}>{p.title}</Link>
                  </>
                ))}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function AdminIntro() {
  return (
    <BlankSlate
      icon="🧑‍💻"
      headline="Все още не са създадени анкети"
      subline={
        <>
          Ти си администратор?{" "}
          <Link href={adminResourcePaths({ resourceType: "polls" }).new}>
            Създай анкета
          </Link>
        </>
      }
    />
  );
}
