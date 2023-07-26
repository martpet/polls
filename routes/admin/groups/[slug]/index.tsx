import { Handlers, PageProps } from "$fresh/server.ts";

import { getGroupBySlug, listPollsByGroup } from "🛠️/db.ts";
import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { resourcesMeta } from "🛠️/restful/meta.ts";
import { Group, Poll } from "🛠️/types.ts";

import ResourceView from "🧱/restful/ResourceView.tsx";
import GroupItem from "🧱/restful/groups/GroupItem.tsx";
import PollsTable from "🧱/restful/polls/PollsTable.tsx";

interface Data {
  group: Group;
  polls: Poll[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const group = await getGroupBySlug(ctx.params.slug);
    if (!group) return ctx.renderNotFound();
    const polls = await listPollsByGroup(group.id);
    return ctx.render({ group, polls });
  },
};

export default function GroupPage({ data }: PageProps<Data>) {
  const { group, polls } = data;
  const pollPaths = adminResourcePaths({ resourceType: "polls" });
  const pollsMeta = resourcesMeta.polls;
  return (
    <ResourceView
      resourceType="groups"
      resource={group}
      item={<GroupItem group={group} />}
      backLink={[pollsMeta.texts.all, pollPaths.base]}
      related={[{
        resourceType: "polls",
        item: <PollsTable polls={polls} group={group} />,
      }]}
    />
  );
}
