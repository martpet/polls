import { Handlers, PageProps } from "$fresh/server.ts";

import { getGroup } from "🛠️/db.ts";
import { Group } from "🛠️/types.ts";

import NewPollView from "🧱/restful/polls/NewPollView.tsx";

interface Data {
  group: Group | null;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const groupId = url.searchParams.get("group");
    const group = groupId ? (await getGroup(groupId)) : null;
    if (group && !groupId) throw new Error("Missing group");
    return ctx.render({ group });
  },
};

export default function NewPollPage({ data }: PageProps<Data>) {
  const { group } = data;
  return <NewPollView group={group} />;
}
