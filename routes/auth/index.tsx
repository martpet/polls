import { HandlerContext, PageProps } from "$fresh/server.ts";

import { getUserBySession } from "🛠️/db.ts";
import { SIGN_IN_PATH } from "🛠️/paths.ts";
import { AuthError, State } from "🛠️/types.ts";

import { authErrorsTexts } from "🛠️/constants.ts";
import Alert from "🧱/Alert.tsx";
import BlankSlate from "🧱/BlankSlate.tsx";
import { ButtonLink } from "🧱/Button.tsx";
import View from "🧱/View.tsx";

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

export default function AuthPage({ url }: PageProps) {
  const authError = url.searchParams.get("error") as AuthError | null;
  const to = url.searchParams.get("to");
  const signinUrl = new URL(url);
  signinUrl.pathname = SIGN_IN_PATH;
  signinUrl.search = "";
  if (to) signinUrl.searchParams.set("to", to);

  return (
    <View
      blankSlate={
        <BlankSlate
          icon={authError ? "🛑" : "🗝️"}
          headline={
            <ButtonLink href={signinUrl.href}>Вход с Google</ButtonLink>
          }
          subline={authError
            ? <Alert>{authErrorsTexts[authError]}</Alert>
            : null}
        />
      }
    />
  );
}
