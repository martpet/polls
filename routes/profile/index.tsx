import { Handlers, PageProps } from "$fresh/server.ts";

import { getUserBySession, listUserVotes } from "🛠️/db.ts";
import { PROFILE_RESET_PATH, SIGN_IN_PATH } from "🛠️/paths.ts";
import { State } from "🛠️/types.ts";

import Link from "🧱/Link.tsx";
import View from "🧱/View.tsx";

interface Data {
  userData?: Record<string, unknown>;
  votes?: { pollId: string; choiceId: string }[];
}

export const handler: Handlers<Data, State> = {
  async GET(_req, ctx) {
    const user = await getUserBySession(ctx.state.session);
    if (!user) {
      return ctx.render({});
    }
    const votes = await listUserVotes(user.id, { consistency: "eventual" });
    const userData = { id: user.id, createdAt: user.createdAt };
    return ctx.render({ votes, userData });
  },
};

export default function MePAGE({ data, url }: PageProps<Data>) {
  const { userData, votes } = data;
  const signInUrl = new URL(url);
  signInUrl.pathname = SIGN_IN_PATH;
  signInUrl.searchParams.set("to", url.pathname);

  return (
    <View headline="Вашият профил" width="sm">
      {!userData && (
        <p>
          <Link href={signInUrl.href} class="underline">
            Влезте в профила си
          </Link>
        </p>
      )}
      {userData && (
        <>
          <h2>Потребител</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
          <h2>Гласувания</h2>

          {votes?.length
            ? <pre>{JSON.stringify(votes, null, 2)}</pre>
            : <p>- няма -</p>}

          {votes?.length! > 0 &&
            (
              <p>
                <Link href={PROFILE_RESET_PATH}>
                  Изтрийте гласуванията си
                </Link>
              </p>
            )}

          <hr />
          <p>
            <em>
              Телефонният Ви номер е записан отделно от останалите Ваши данни и
              не може да бъде асоцииран с Вас.
            </em>
          </p>
        </>
      )}
    </View>
  );
}
