import { Handlers, PageProps } from "$fresh/server.ts";

import { getEnv } from "🛠️/env.ts";

import Link from "🧱/Link.tsx";
import View from "🧱/View.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const res = await ctx.render();
    res.headers.set("Cache-Control", `public, max-age=${60 * 15}`);
    return res;
  },
};

export default function ContactsPage({ url }: PageProps) {
  const adminEmail = getEnv("BG_ADMIN_EMAIL");

  return (
    <View headline="Контакти" footerProps={{ hideContacts: true }}>
      <p>Свържете се с автора на сайта:</p>
      <address class="not-italic flex flex-col gap-3">
        <Link href={`mailto:${adminEmail}`}>
          {adminEmail}
        </Link>
      </address>
    </View>
  );
}
