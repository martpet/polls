import { ComponentChildren } from "preact";

import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/restful/meta.ts";
import { Resource, ResourceType } from "🛠️/restful/types.ts";

import Link from "🧱/Link.tsx";
import DeleteResourceForm from "🧱/restful/DeleteResourceForm.tsx";
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
      headline={meta.texts.delete}
      subline={String(title)}
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
