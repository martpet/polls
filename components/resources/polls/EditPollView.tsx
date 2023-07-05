import { EditResourceProps } from "🛠️/resources/types.ts";
import { Group, Poll } from "🛠️/types.ts";

import EditResourceView from "🧱/resources/EditResourceView.tsx";
import PollFormFields from "🧱/resources/polls/PollFormFields.tsx";

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
