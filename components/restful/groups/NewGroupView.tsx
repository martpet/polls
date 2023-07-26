import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { NewResourceProps } from "🛠️/restful/types.ts";
import { Group } from "🛠️/types.ts";

import NewResourceView from "🧱/restful/NewResourceView.tsx";
import GroupFormFields from "🧱/restful/groups/GroupFormFields.tsx";

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
