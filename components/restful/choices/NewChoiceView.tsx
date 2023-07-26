import { adminResourcePaths } from "🛠️/restful/functions.ts";
import { NewResourceProps } from "🛠️/restful/types.ts";
import { Choice, Group, Poll } from "🛠️/types.ts";

import NewResourceView from "🧱/restful/NewResourceView.tsx";
import ChoiceFormFields from "🧱/restful/choices/ChoiceFormFields.tsx";

interface Props extends NewResourceProps<Choice> {
  poll: Poll;
  group: Group | null;
}

export default function NewChoiceView(props: Props) {
  const { formEntry, formErrors, poll, group } = props;
  const pollPaths = adminResourcePaths({
    resourceType: "polls",
    resource: poll,
  });
  return (
    <NewResourceView
      resourceType="choices"
      subline={`${group ? `${group.title}, ` : ""}${poll.title}`}
      formBackLink={pollPaths.view}
      formFields={
        <ChoiceFormFields
          formEntryOrResource={formEntry}
          formErrors={formErrors}
          poll={poll}
        />
      }
    />
  );
}
