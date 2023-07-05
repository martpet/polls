import { getCountryName } from "🛠️/intl.ts";
import { VoteRequestCheck } from "🛠️/vote-check.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import Quotes from "🧱/Quotes.tsx";
import View from "🧱/View.tsx";

interface Props {
  requestCheck: VoteRequestCheck;
  backLink?: Readonly<[string, string]>;
}

export default function FailedVoteCheckView(props: Props) {
  const { requestCheck, backLink } = props;
  const { status, ip, countryCode, city, cityFilter } = requestCheck;
  const countryName = getCountryName(countryCode!);
  const headline = "Проблем с Вашия IP адрес";
  const proxyText = "Ако влизате през прокси сървър - спрете го.";
  const neededIPText = (
    <>
      В сайта може да се гласува само с български <em>IP</em> адрес.
    </>
  );
  let description;

  if (
    status === "missing_country_header" ||
    status === "country_unknown"
  ) {
    description = (
      <>
        Не можем да разберем от коя държавата е Вашият <em>IP</em> адрес.{" "}
        {neededIPText}
      </>
    );
  } else if (status === "tor") {
    description = (
      <>
        Вие използвате <Quotes>Тор</Quotes>{" "}
        браузър. Моля, временно го спрете, за да видя реалния ви <em>IP</em>
        {" "}
        адрес. {neededIPText}
      </>
    );
  } else if (status === "country_mismatch") {
    description = (
      <>
        Вашият <em>IP</em> адрес <Quotes>{ip}</Quotes> e от {countryName}.{" "}
        {neededIPText} {proxyText}
      </>
    );
  } else if (status === "city_mismatch") {
    description = (
      <>
        Вашият <em>IP</em> адрес <em>{ip}</em> e от{" "}
        <Quotes>{city}</Quotes>, а анкетата изисква той да бъде от{" "}
        <Quotes>{cityFilter}</Quotes>. {proxyText}.
      </>
    );
  }

  return (
    <View
      docTitle={headline}
      backLink={backLink}
      blankSlate={
        <BlankSlate
          icon="🚫"
          headline={headline}
          subline={description}
        />
      }
    />
  );
}
