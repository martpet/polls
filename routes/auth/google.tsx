import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getUserBySession } from "🛠️/db.ts";
import { SIGN_IN_PATH } from "🛠️/paths.ts";
import { State } from "🛠️/types.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import { ButtonLink } from "🧱/Button.tsx";
import AdminView from "🧱/views/AdminView.tsx";

export async function handler(
  _req: Request,
  ctx: HandlerContext<undefined, State>,
) {
  const user = await getUserBySession(ctx.state.session);
  if (user) {
    return new Response(null, {
      headers: { Location: "/" },
      status: 303,
    });
  }
  return ctx.render();
}

export default function GoogleAuthPage({ url }: PageProps) {
  const from = url.searchParams.get("from");
  return (
    <AdminView
      blankSlate={
        <BlankSlate
          icon="🗝️"
          headline={
            <ButtonLink href={`${SIGN_IN_PATH}${from ? `?from=${from}` : ""}`}>
              Вход с Google
            </ButtonLink>
          }
        />
      }
    />
  );
}
