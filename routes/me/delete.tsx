import { Handlers, PageProps } from "$fresh/server.ts";

import { deleteUser, getUserBySession } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";

import { ME_PATH, SIGN_IN_PATH } from "🛠️/paths.ts";
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
    await deleteUser(user.id);
    return ctx.render({ user, success: true });
  },
};

export default function DeleteMyDatePage({ data, url }: PageProps<Data>) {
  const { user, success } = data;
  if (success) {
    return (
      <View
        blankSlate={
          <BlankSlate
            headline="Профилът Ви беше изтрит."
            subline="Всички Ваши лични данни и гласувания са премахнати."
            icon="✅"
          />
        }
      />
    );
  }
  return (
    <View headline="Изтрийте личните си данни" width="sm">
      {!user && (
        <p>
          <Link href={`${SIGN_IN_PATH}?from=${ME_PATH}`}>
            Влезте в профила си
          </Link>, за да изтриета личните си данни.
        </p>
      )}
      {user && (
        <>
          <p>
            Вашият профил, както и гласуванията Ви, ще бъдат безвъзвратно
            изтрити.
          </p>
          <form method="post" action={url.href}>
            <Input
              type="checkbox"
              required
              label="Добре, разбрах"
              noAsterisk
            />
            <Button small danger class="mt-5">Изтрий</Button>
          </form>
        </>
      )}
    </View>
  );
}
