import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { resourcesMeta } from "🛠️/restful/meta.ts";

import Link from "🧱/Link.tsx";
import AdminView from "🧱/views/AdminView.tsx";

export default function AdminPage() {
  const resources = ["polls"] as const;

  return (
    <AdminView>
      <nav class="flex flex-col gap-2">
        {resources.map((resourceType) => {
          return (
            <Link href={adminResourcePaths({ resourceType }).base}>
              {resourcesMeta[resourceType].texts.namePlural}
            </Link>
          );
        })}
      </nav>
    </AdminView>
  );
}
