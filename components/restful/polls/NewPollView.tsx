import { NewResourceProps } from "🛠️/restful/types.ts";
import { Group, Poll } from "🛠️/types.ts";

import { adminResourcePaths } from "🛠️/restful/functions.ts";
import NewResourceView from "🧱/restful/NewResourceView.tsx";
import PollFormFields from "🧱/restful/polls/PollFormFields.tsx";

interface Props extends NewResourceProps<Poll> {
  group: Group | null;
}

export default function NewPollView(props: Props) {
  const { formEntry, formErrors, group } = props;
  const groupPaths = adminResourcePaths({
    resourceType: "groups",
    resource: group,
  });
  return (
    <NewResourceView
      resourceType="polls"
      subline={group?.title}
      formBackLink={groupPaths.view}
      formFields={
        <PollFormFields
          formEntryOrResource={formEntry}
          formErrors={formErrors}
          group={group}
        />
      }
    />
  );
}
