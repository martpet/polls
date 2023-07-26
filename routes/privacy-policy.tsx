import { Handlers, PageProps } from "$fresh/server.ts";

import PrivacyPolicy from "🧱/PrivacyPolicy.tsx";
import View from "🧱/View.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const res = await ctx.render();
    res.headers.set("Cache-Control", `public, max-age=${60 * 15}`);
    return res;
  },
};

export default function PrivacyPolicyPage({ url }: PageProps) {
  return (
    <View
      width="sm"
      headline="Декларация за поверителност"
      footerProps={{ hidePrivacyPolicy: true }}
    >
      <PrivacyPolicy />
    </View>
  );
}
