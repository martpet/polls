import { ComponentChildren } from "preact";

import { resourcesMeta } from "🛠️/resources/meta.ts";
import { ResourceType } from "🛠️/resources/types.ts";

import NewResourceForm from "🧱/resources/NewResourceForm.tsx";
import AdminView, { AdminViewProps } from "🧱/views/AdminView.tsx";

export interface Props extends AdminViewProps {
  resourceType: ResourceType;
  formFields: ComponentChildren;
  formBackLink?: string;
}

export default function NewResourceView(props: Props) {
  const { resourceType, formFields, formBackLink, ...viewProps } = props;
  const meta = resourcesMeta[resourceType];
  return (
    <AdminView
      headline={meta.texts.new}
      width="sm"
      center
      {...viewProps}
    >
      <NewResourceForm
        resourceType={resourceType}
        formFields={formFields}
        backLink={formBackLink}
      />
    </AdminView>
  );
}
