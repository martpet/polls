import { useEffect, useState } from "preact/hooks";

import ChoicesTableBody, { ChoicesTableProps } from "🧱/ChoicesTableBody.tsx";

const FETCH_INTERVAL_MS = 10 * 1000;

export default function ChoicesTableBodyPull(props: ChoicesTableProps) {
  const [choices, setChoices] = useState(props.choices);

  useEffect(() => {
    fetchVotes();
    function fetchVotes() {
      setTimeout(async () => {
        const res = await fetch(`/api/polls/${props.pollId}`);
        const data = await res.json();
        setChoices(data.choices);
        fetchVotes();
      }, FETCH_INTERVAL_MS);
    }
  }, []);

  return <ChoicesTableBody {...props} choices={choices} />;
}
