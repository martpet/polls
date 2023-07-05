import { ErrorPageProps } from "$fresh/server.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import View from "🧱/View.tsx";

export default function Error500Page({ error }: ErrorPageProps) {
  return (
    <View
      blankSlate={
        <BlankSlate
          icon="💥"
          headline="Бъг"
          subline={<pre>{String(error)}</pre>}
          fullWidth
        />
      }
    />
  );
}
