import { ADMIN_PATH } from "🛠️/paths.ts";

import View, { ViewProps } from "🧱/View.tsx";

export type AdminViewProps = ViewProps;

export default function AdminView(props: AdminViewProps) {
  let { headline, docTitle, breadcrumbs, ...viewProps } = props;
  docTitle ??= headline;
  if (breadcrumbs) {
    breadcrumbs = { "Админ": ADMIN_PATH, ...breadcrumbs };
  }
  return (
    <View
      noFooter
      headline={headline || "Админ"}
      docTitle={`Админ${docTitle ? ` | ${docTitle}` : ""}`}
      breadcrumbs={breadcrumbs}
      width="auto"
      center={false}
      {...viewProps}
    />
  );
}
