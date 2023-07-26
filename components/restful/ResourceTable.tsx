import { ComponentChildren } from "preact";

import {
  adminResourcePaths,
  getFieldAttrFromSelector,
  selectResourceField,
} from "🛠️/restful/functions.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/restful/meta.ts";
import {
  MaybeResourceWithType,
  ResourceFieldSelector,
  ResourceType,
} from "🛠️/restful/types.ts";

import { MappedCollectionMaybe } from "🛠️/types.ts";

import Actions, { ActionsProps } from "🧱/Actions.tsx";
import Link from "🧱/Link.tsx";
import Table, { TableProps } from "🧱/Table.tsx";

export interface ResourceTableProps<T extends MaybeResourceWithType> {
  resourceType: ResourceType;
  resources: MappedCollectionMaybe<T>;
  fields: ResourceFieldSelector<T>[];
  align?: Partial<Record<keyof T, "center" | "end">>;
  newResourceURLParams?: URLSearchParams | null;
  actions?: ComponentChildren;
  actionsProps?: Partial<ActionsProps>;
  HeadingTag?: "h2" | "h3" | "h4";
}

///////////////////////
// Resource Table Group
///////////////////////

type ResourceTableGroupProps<T extends MaybeResourceWithType> =
  & ResourceTableProps<T>
  & Omit<TableProps, "children">;

export default function ResourceTableGroup<T extends MaybeResourceWithType>(
  props: ResourceTableGroupProps<T>,
) {
  const { resources, HeadingTag = "h2", ...rest } = props;
  if (Array.isArray(resources)) {
    return <ResourceTable resources={resources} {...rest} />;
  }
  return (
    <>
      {Object.entries(resources).map(([title, groupedResources]) => (
        <section>
          <HeadingTag>{title}</HeadingTag>
          <ResourceTable resources={groupedResources!} {...rest} />
        </section>
      ))}
    </>
  );
}

//////////////////
// Resource Table
/////////////////

interface Props<T extends MaybeResourceWithType>
  extends Omit<ResourceTableGroupProps<T>, "resources" | "HeadingTag"> {
  resources: T[];
}

export function ResourceTable<T extends MaybeResourceWithType>(
  props: Props<T>,
) {
  const {
    resourceType,
    resources,
    fields,
    align,
    newResourceURLParams,
    actions,
    actionsProps,
    ...tableHTMLProps
  } = props;
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  const paths = adminResourcePaths({ resourceType });
  let pathNew = paths.new;
  if (newResourceURLParams) {
    pathNew += `?${newResourceURLParams}`;
  }
  return (
    <>
      {resources.length > 0 && (
        <Table {...tableHTMLProps}>
          <thead>
            <tr>
              {fields.map((selector) => {
                const attr = getFieldAttrFromSelector<T>(selector);
                const dataLabel = meta.attrLabels[attr];
                const alignAttr = align?.[attr];
                return (
                  <th class={alignAttr ? `text-${alignAttr}` : ""}>
                    {dataLabel}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => {
              const paths = adminResourcePaths({
                resourceType: resource._type || resourceType,
                resource,
              });
              return (
                <tr>
                  {fields.map((selector) => {
                    const attr = getFieldAttrFromSelector(selector);
                    const alignAttr = align?.[attr];
                    const value = selectResourceField({
                      resourceType,
                      resource,
                      selector,
                    });

                    return (
                      <td class={alignAttr ? `text-${alignAttr}` : ""}>
                        {attr === meta.titleAttr
                          ? (
                            <Link href={paths.view} name={resource.id}>
                              {value}
                            </Link>
                          )
                          : value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Actions {...actionsProps}>
        <Link href={pathNew}>
          {meta.texts.add}
          {actions}
        </Link>
      </Actions>
    </>
  );
}
