import { ComponentChildren } from "preact";

import { adminResourcePaths } from "🛠️/resources/functions.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/resources/meta.ts";
import { Resource, ResourceType } from "🛠️/resources/types.ts";

import Link from "🧱/Link.tsx";
import DeleteResourceForm from "🧱/resources/DeleteResourceForm.tsx";
import AdminView, { AdminViewProps } from "🧱/views/AdminView.tsx";

interface Props<T> extends AdminViewProps {
  resourceType: ResourceType;
  resource: T;
  blockage?: ComponentChildren;
  formSubContent?: ComponentChildren;
}

export default function DeleteResourceView<T extends Resource>(
  props: Props<T>,
) {
  const { resourceType, resource, blockage, formSubContent, ...viewProps } =
    props;
  const paths = adminResourcePaths({ resource, resourceType });
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  const slug = resource[meta.slugAttr];
  const title = resource[meta.titleAttr];
  return (
    <AdminView
      docTitle={`${meta.texts.delete}: ${slug}`}
      headline={String(title)}
      overline={`${meta.texts.delete}:`}
      width="sm"
      center
      {...viewProps}
    >
      {blockage
        ? (
          <>
            {blockage}
            <Link href={paths.view}>
              Назад
            </Link>
          </>
        )
        : (
          <DeleteResourceForm
            resourceType={resourceType}
            resource={resource}
            formSubContent={formSubContent}
          />
        )}
    </AdminView>
  );
}
