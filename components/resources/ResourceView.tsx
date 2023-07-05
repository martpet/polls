import { ComponentChildren } from "preact";

import { adminResourcePaths } from "🛠️/resources/functions.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/resources/meta.ts";
import { Resource, ResourceType } from "🛠️/resources/types.ts";

import AdminView, { AdminViewProps } from "🧱/views/AdminView.tsx";

export interface ResourceViewProps<T extends Resource> extends AdminViewProps {
  resourceType: ResourceType;
  resource: T;
  item: ComponentChildren;
  related?: Array<{
    resourceType: ResourceType;
    item: ComponentChildren;
  }>;
}

export default function ResourceView<T extends Resource>(
  props: ResourceViewProps<T>,
) {
  const {
    resourceType,
    resource,
    item,
    backLink,
    related,
    ...viewProps
  } = props;
  const paths = adminResourcePaths({ resourceType });
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  const title = resource[meta.titleAttr];

  return (
    <AdminView
      headline={String(title)}
      overline={`${meta.texts.name}:`}
      backLink={backLink || [meta.texts.all, paths.base]}
      {...viewProps}
    >
      {item}
      {related?.map((rel) => (
        <section>
          <h2>{resourcesMeta[rel.resourceType]?.texts.namePlural}</h2>
          {rel.item}
        </section>
      ))}
    </AdminView>
  );
}
