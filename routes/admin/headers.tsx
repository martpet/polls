import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req: Request) {
    return new Response(
      JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2),
    );
  },
};
