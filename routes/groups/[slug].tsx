import { Handlers, PageProps } from "$fresh/server.ts";
import { BACK_LINK_ALL } from "🛠️/constants.ts";
import { sortPolls } from "🛠️/sort.ts";

import { getGroupBySlug, listPollsByGroup } from "🛠️/db.ts";
import { Group, Poll } from "🛠️/types.ts";

import Link from "🧱/Link.tsx";
import View from "🧱/View.tsx";

interface Data {
  group: Group;
  polls: Poll[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const group = await getGroupBySlug(ctx.params.slug, {
      consistency: "eventual",
    });
    if (!group) return ctx.renderNotFound();
    const polls = await listPollsByGroup(group.id, { consistency: "eventual" });
    const res = await ctx.render({ group, polls });
    res.headers.set("Cache-Control", "public, max-age=600");
    return res;
  },
};

export default function GroupPage({ data }: PageProps<Data>) {
  const { group, polls } = data;
  const sortedPolls = polls.toSorted(sortPolls);
  return (
    <View
      headline={group.title}
      backLink={BACK_LINK_ALL}
    >
      <ul>
        {sortedPolls.map((poll) => (
          <li>
            <Link href={`/${poll.slug}`}>{poll.title}</Link>
          </li>
        ))}
      </ul>
    </View>
  );
}
