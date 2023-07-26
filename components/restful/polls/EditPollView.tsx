import { EditResourceProps } from "🛠️/restful/types.ts";
import { Group, Poll } from "🛠️/types.ts";

import EditResourceView from "🧱/restful/EditResourceView.tsx";
import PollFormFields from "🧱/restful/polls/PollFormFields.tsx";

type Props = EditResourceProps<Poll> & {
  group: Group | null;
};

export default function EditPollView(props: Props) {
  const { resource, formEntry, formErrors, group } = props;
  const formEntryOrResource = formEntry || resource;
  return (
    <EditResourceView
      resourceType="polls"
      formEntryOrResource={formEntryOrResource}
      subline={group?.title}
      formFields={
        <PollFormFields
          formEntryOrResource={formEntryOrResource}
          formErrors={formErrors}
          group={group}
        />
      }
    />
  );
}
