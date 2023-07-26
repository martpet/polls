import { ErrorPageProps } from "$fresh/server.ts";

import { getEnv } from "🛠️/env.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import View from "🧱/View.tsx";

export default function Error500Page({ error }: ErrorPageProps) {
  const email = getEnv("BG_ADMIN_EMAIL");
  return (
    <View
      blankSlate={
        <BlankSlate
          icon="💥"
          headline="Бъг"
          subline={
            <>
              <pre>{String(error)}</pre>
              <p>
                Моля, уведомете админстратора за този бъг:{" "}
                <a href={`mailto:${email}`}>{email}</a>. Благодаря!
              </p>
            </>
          }
          fullWidth
        />
      }
    />
  );
}
