import { ComponentChildren } from "preact";

import { FormEntry } from "🛠️/forms.ts";
import { ADMIN_PATH } from "🛠️/paths.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/restful/meta.ts";
import {
  Resource,
  ResourceFieldSelector,
  ResourceType,
} from "🛠️/restful/types.ts";

/*
 * selectResourceField
 */
interface SelectResourceFieldConfig<T extends Resource> {
  resourceType: ResourceType;
  resource: T;
  selector: ResourceFieldSelector<T>;
}

export function selectResourceField<T extends Resource>(
  config: SelectResourceFieldConfig<T>,
) {
  const { resourceType, resource, selector } = config;
  const attr = getFieldAttrFromSelector<T>(selector);
  const value = resource[attr];
  if (typeof selector === "string") {
    return formatResourceValue({ resourceType, resource, attr, value });
  }
  const inlineFormatter = Object.values(selector)[0];
  return inlineFormatter(value, { resource }) || "-";
}

/*
 * resourceValueFormatter
 */

interface FormatResourceValueConfig<T extends Resource> {
  resourceType: ResourceType;
  resource: T;
  attr: keyof T;
  value: T[keyof T];
}

export function formatResourceValue<T extends Resource>(
  config: FormatResourceValueConfig<T>,
) {
  const { resourceType, resource, attr, value } = config;
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  const formatter = meta.formatters[attr];
  let result = value as ComponentChildren;
  if (formatter) {
    result = formatter(value, { resource });
  }
  if (typeof result === "boolean") {
    return result ? "Да" : "Не";
  }
  return (result === "" || result === null || result === undefined)
    ? "-"
    : result;
}

/*
 * getFieldAttrFromSelector
 */
export function getFieldAttrFromSelector<T = Resource>(
  formatter: ResourceFieldSelector<T>,
) {
  return (typeof formatter === "string"
    ? formatter
    : Object.keys(formatter)[0]) as keyof T;
}

/*
 * resourcePaths
 */

interface ResourcePathsConfig<T> {
  resourceType: ResourceType;
  resource?: FormEntry<T> | T | null;
  prefixPath?: string;
}

export function resourcePaths<T extends Resource>(
  config: ResourcePathsConfig<T>,
) {
  const { resourceType, resource, prefixPath } = config;
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  let basePath = "";
  if (prefixPath) {
    basePath += prefixPath;
  }
  if (meta.urlSegment) {
    basePath += `/${meta.urlSegment}`;
  } else {
    basePath += `/${resourceType}`;
  }
  const newPath = `${basePath}/new`;
  if (!resource) {
    return {
      base: basePath,
      new: newPath,
    };
  }
  const slug = resource[meta.slugAttr];
  const viewPath = `${basePath}/${slug}`;
  const editPath = `${basePath}/${slug}/edit`;
  const deletePath = `${basePath}/${slug}/delete`;
  return {
    base: basePath,
    new: newPath,
    view: viewPath,
    edit: editPath,
    delete: deletePath,
  };
}

export function adminResourcePaths<T extends Resource>(
  config: ResourcePathsConfig<T>,
) {
  config.prefixPath = ADMIN_PATH;
  return resourcePaths(config);
}

export function addTypeToResources<T extends Resource>(
  obj: Partial<Record<ResourceType, T[]>>,
) {
  const _type = Object.keys(obj)[0] as ResourceType;
  const resources = Object.values(obj)[0];
  return resources.map((resource) => ({ _type, ...resource }));
}
