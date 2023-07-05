import { useEffect, useState } from "preact/hooks";

import { ChoicesTableBody, ChoicesTableBodyProps } from "🧱/ChoicesTable.tsx";

const FETCH_INTERVAL_MS = 10 * 1000;

export default function ChoicesTableBodyIsland(props: ChoicesTableBodyProps) {
  const [choices, setChoices] = useState(props.choices);

  useEffect(() => {
    fetchChoices();
    function fetchChoices() {
      setTimeout(async () => {
        const res = await fetch(`/api/polls/${props.pollId}`);
        const data = await res.json();
        setChoices(data.choices);
        fetchChoices();
      }, FETCH_INTERVAL_MS);
    }
  }, []);

  return <ChoicesTableBody {...props} choices={choices} />;
}
