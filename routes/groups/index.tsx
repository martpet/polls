import { Handlers } from "$fresh/server.ts";

import { ALL_PATH } from "🛠️/paths.ts";

export const handler: Handlers = {
  GET() {
    return new Response(null, {
      headers: { location: ALL_PATH },
      status: 301,
    });
  },
};
