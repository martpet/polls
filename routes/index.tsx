import { Handlers } from "$fresh/server.ts";

import { getHomePoll } from "🛠️/db.ts";
import { ALL_PATH } from "🛠️/paths.ts";

export const handler: Handlers = {
  async GET() {
    const homePoll = await getHomePoll({ consistency: "eventual" });
    return new Response(null, {
      headers: {
        location: homePoll ? `/${homePoll.slug}` : ALL_PATH,
        "Cache-Control": "public, max-age=600",
      },
      status: 301,
    });
  },
};
