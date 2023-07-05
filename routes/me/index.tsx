import { Handlers, PageProps } from "$fresh/server.ts";

import { getUserBySession, listUserChoices } from "🛠️/db.ts";
import {
  DELETE_ME_PATH,
  DOWNLOAD_MY_DATA_PATH,
  SIGN_IN_PATH,
} from "🛠️/paths.ts";
import { State } from "🛠️/types.ts";

import DefList, { Def } from "🧱/DefList.tsx";
import Link from "🧱/Link.tsx";
import View from "🧱/View.tsx";

interface Data {
  userData?: {
    user: Record<string, unknown>;
    votes: { pollId: string; choiceId: string }[];
  };
}

export const handler: Handlers<Data, State> = {
  async GET(_req, ctx) {
    const user = await getUserBySession(ctx.state.session);
    if (!user) {
      return ctx.render({});
    }
    const votes = await listUserChoices(user.id, { consistency: "eventual" });
    const userData = {
      user: {
        id: user.id,
        accountValidity: user.accountValidity,
        createdAt: user.createdAt,
      },
      votes,
    };
    return ctx.render({ userData });
  },
};

export default function MyData({ data, url }: PageProps<Data>) {
  const { userData } = data;

  return (
    <View headline="Вашите лични данни" width="sm">
      {!userData && (
        <p>
          <Link href={`${SIGN_IN_PATH}?from=${url.pathname}`}>
            Влезте в профила си
          </Link>, за да видите личните си данни.
        </p>
      )}
      {userData && (
        <>
          <p>
            Всичката информация за Вас, с която сайтът разполага, е показана
            тук. Телефонният Ви номер няма как да бъде показан, защото сайтът не
            асоциира телефонните номера с потребителите.
          </p>

          <p>
            <Link href={DOWNLOAD_MY_DATA_PATH} download="glasuvane_my_data">
              Свалете
            </Link>{" "}
            или <Link href={DELETE_ME_PATH}>изтрийте</Link> Вашите данни.
          </p>

          <hr />

          <DefList>
            <Def term="Потребител:">
              <pre>{JSON.stringify(userData.user, null, 2)}</pre>
            </Def>
            {userData.votes.length > 0 && (
              <Def term="Гласувания:">
                <pre>{JSON.stringify(userData.votes, null, 2)}</pre>
              </Def>
            )}
          </DefList>
        </>
      )}
    </View>
  );
}
