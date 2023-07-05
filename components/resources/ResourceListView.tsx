import { ComponentChildren } from "preact";

import { ADMIN_PATH } from "🛠️/paths.ts";
import { resourcesMeta } from "🛠️/resources/meta.ts";
import { ResourceType } from "🛠️/resources/types.ts";

import AdminView, { AdminViewProps } from "🧱/views/AdminView.tsx";

interface Props extends AdminViewProps {
  resourceType: ResourceType;
  view: ComponentChildren;
  related?: Array<{
    resourceType: ResourceType;
    view: ComponentChildren;
  }>;
}

export default function ResourceListView(props: Props) {
  const { view, resourceType, related, ...viewProps } = props;
  const meta = resourcesMeta[resourceType];

  return (
    <AdminView
      headline={meta.texts.namePlural}
      backLink={["Админ", ADMIN_PATH]}
      {...viewProps}
    >
      {view}
      {related?.map((item) => (
        <section>
          <h2>{resourcesMeta[item.resourceType]?.texts.namePlural}</h2>
          {item.view}
        </section>
      ))}
    </AdminView>
  );
}
