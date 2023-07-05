import {
  adminResourcePaths,
  getFieldAttrFromSelector,
  selectResourceField,
} from "🛠️/resources/functions.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/resources/meta.ts";
import {
  Resource,
  ResourceFieldSelector,
  ResourceType,
} from "🛠️/resources/types.ts";

import Actions from "🧱/Actions.tsx";
import DefList, { Def } from "🧱/DefList.tsx";
import Link from "🧱/Link.tsx";

interface Props<T extends Resource> {
  resourceType: ResourceType;
  resource: T;
  fields: ResourceFieldSelector<T>[];
  newResourceURLParams?: URLSearchParams;
}

export default function ResourceItem<T extends Resource>(props: Props<T>) {
  const { resourceType, resource, fields, newResourceURLParams } = props;
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  const paths = adminResourcePaths({ resourceType, resource });

  return (
    <>
      <DefList dense horizontal>
        {fields.map((selector) => {
          const dataAttr = getFieldAttrFromSelector<T>(selector);
          const fieldValue = selectResourceField({
            resourceType,
            resource,
            selector,
          });
          const fieldLabel = meta.attrLabels[dataAttr];
          return <Def term={fieldLabel}>{fieldValue}</Def>;
        })}
      </DefList>
      <Actions class="mt-7">
        <Link href={paths.edit}>
          Редактирай
        </Link>
        <Link danger href={paths.delete}>
          Изтрий
        </Link>
      </Actions>
    </>
  );
}
