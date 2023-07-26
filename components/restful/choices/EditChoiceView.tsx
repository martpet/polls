import { EditResourceProps } from "🛠️/restful/types.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

import EditResourceView from "🧱/restful/EditResourceView.tsx";
import ChoiceFormFields from "🧱/restful/choices/ChoiceFormFields.tsx";

type Props = EditResourceProps<Choice> & {
  poll: Poll;
  group: Group | null;
};

export default function EditChoiceView(props: Props) {
  const { resource, formEntry, formErrors, poll, group } = props;
  const formEntryOrResource = formEntry || resource;
  return (
    <EditResourceView
      resourceType="choices"
      formEntryOrResource={formEntryOrResource}
      subline={`${group ? `${group.title}, ` : ""}${poll.title}`}
      formFields={
        <ChoiceFormFields
          formEntryOrResource={formEntryOrResource}
          formErrors={formErrors}
          poll={poll}
        />
      }
    />
  );
}
