import { EditResourceProps } from "🛠️/resources/types.ts";
import { Group } from "🛠️/types.ts";

import EditResourceView from "🧱/resources/EditResourceView.tsx";
import GroupFormFields from "🧱/resources/groups/GroupFormFields.tsx";

type Props = EditResourceProps<Group>;

export default function EditGroupView(props: Props) {
  const { resource, formEntry, formErrors } = props;
  const formEntryOrResource = formEntry || resource;
  return (
    <EditResourceView
      resourceType="groups"
      formEntryOrResource={formEntryOrResource}
      formFields={
        <GroupFormFields
          formEntryOrResource={formEntryOrResource}
          formErrors={formErrors}
        />
      }
    />
  );
}
