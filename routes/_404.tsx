import BlankSlate from "🧱/BlankSlate.tsx";
import Link from "🧱/Link.tsx";
import View from "🧱/View.tsx";

export default function NotFoundPage() {
  return (
    <View
      blankSlate={
        <BlankSlate
          icon="🤔"
          grayscale
          headline="Няма такава страница"
          subline={<Link href="/" class="underline">Начало</Link>}
        />
      }
    />
  );
}
