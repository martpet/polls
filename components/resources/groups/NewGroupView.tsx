import { adminResourcePaths } from "🛠️/resources/functions.ts";
import { NewResourceProps } from "🛠️/resources/types.ts";
import { Group } from "🛠️/types.ts";

import NewResourceView from "🧱/resources/NewResourceView.tsx";
import GroupFormFields from "🧱/resources/groups/GroupFormFields.tsx";

type Props = NewResourceProps<Group>;

export default function NewGroupView(props: Props) {
  const { formEntry, formErrors } = props;
  const pollPaths = adminResourcePaths({ resourceType: "polls" });
  return (
    <NewResourceView
      resourceType="groups"
      formBackLink={pollPaths.base}
      formFields={
        <GroupFormFields
          formEntryOrResource={formEntry}
          formErrors={formErrors}
        />
      }
    />
  );
}
