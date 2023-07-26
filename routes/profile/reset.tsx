import { Handlers, PageProps } from "$fresh/server.ts";

import { deleteUser, deleteUserSession, getUserBySession } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";

import { PROFILE_PATH, SIGN_IN_PATH } from "🛠️/paths.ts";
import BlankSlate from "🧱/BlankSlate.tsx";
import Button from "🧱/Button.tsx";
import { Input } from "🧱/FormField.tsx";
import Link from "🧱/Link.tsx";
import View from "🧱/View.tsx";

interface Data {
  user: User | null;
  success?: boolean;
}

export const handler: Handlers<Data, State> = {
  async GET(_req, ctx) {
    const user = await getUserBySession(ctx.state.session);
    return ctx.render({ user });
  },
  async POST(_req, ctx) {
    const user = await getUserBySession(ctx.state.session);
    if (!user) {
      return new Response(null, { status: 401 });
    }
    await Promise.all([
      deleteUser(user.id),
      deleteUserSession(ctx.state.session!),
    ]);
    return ctx.render({ user, success: true });
  },
};

export default function DeleteMyDatePage({ data, url }: PageProps<Data>) {
  const { user, success } = data;

  const signInUrl = new URL(url);
  signInUrl.pathname = SIGN_IN_PATH;
  signInUrl.searchParams.set("to", url.pathname);

  if (success) {
    return (
      <View
        blankSlate={
          <BlankSlate
            icon="👍"
            headline="Гласуванията Ви бяха изтрити"
            subline={<Link href={PROFILE_PATH}>Профил</Link>}
          />
        }
      />
    );
  }
  return (
    <View
      headline="Изтрийте гласуванията си"
      width="sm"
      backLink={["Профил", PROFILE_PATH]}
    >
      {!user && (
        <p>
          <Link href={signInUrl.href} class="underline">
            Влезте в профила си
          </Link>
        </p>
      )}
      {user && (
        <form method="post">
          <Input
            type="checkbox"
            required
            label="Потвърждавам"
            noAsterisk
          />
          <Button small danger class="mt-5">Изтрий</Button>
        </form>
      )}
    </View>
  );
}
