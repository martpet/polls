import { ComponentChildren } from "preact";

import { FormEntry } from "🛠️/forms.ts";
import { ResourceMeta, resourcesMeta } from "🛠️/resources/meta.ts";
import { Resource, ResourceType } from "🛠️/resources/types.ts";

import EditResourceForm from "🧱/resources/EditResourceForm.tsx";
import AdminView, { AdminViewProps } from "🧱/views/AdminView.tsx";

interface Props<T extends Resource> extends AdminViewProps {
  resourceType: ResourceType;
  formEntryOrResource: FormEntry<T> | T;
  formFields: ComponentChildren;
}

export default function EditResourceView<T extends Resource>(props: Props<T>) {
  const {
    resourceType,
    formEntryOrResource,
    formFields,
    ...viewProps
  } = props;
  const meta = resourcesMeta[resourceType] as ResourceMeta<T>;
  const slug = formEntryOrResource[meta.slugAttr];
  const title = formEntryOrResource[meta.titleAttr];
  return (
    <AdminView
      docTitle={`${meta.texts.edit}: ${slug}`}
      headline={title?.toString()}
      overline={`${meta.texts.edit}:`}
      width="sm"
      center
      {...viewProps}
    >
      <EditResourceForm
        resourceType={resourceType}
        formEntryOrResource={formEntryOrResource}
        formFields={formFields}
      />
    </AdminView>
  );
}
