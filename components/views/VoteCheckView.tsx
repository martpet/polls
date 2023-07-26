import { getCountryName } from "🛠️/intl.ts";
import { VoteRequestCheck } from "🛠️/vote-check.ts";

import BlankSlate from "🧱/BlankSlate.tsx";
import Quotes from "🧱/Quotes.tsx";
import View from "🧱/View.tsx";

interface Props {
  voteCheck: VoteRequestCheck;
  backLink?: Readonly<[string, string]>;
}

export default function VoteCheckView(props: Props) {
  const { voteCheck, backLink } = props;
  const { status, ip, countryCode, city, cityFilter } = voteCheck;
  const countryName = getCountryName(countryCode!);
  const headline = "Проблем с Вашия IP адрес";
  const countryIpText = "Той трябва да е от България.";

  let message;

  if (status === "missing_ip_header") {
    message = (
      <>
        Не можем да установим Вашия IP адрес.
      </>
    );
  } else if (
    status === "missing_country_header" ||
    status === "country_unknown"
  ) {
    message = (
      <>
        Не можем да установим от коя държавата е Вашият IP адрес.{" "}
        {countryIpText}
      </>
    );
  } else if (status === "tor") {
    message = (
      <>
        Вие използвате <Quotes>Тор</Quotes> браузър. Моля, временно го спрете.
      </>
    );
  } else if (status === "country_mismatch") {
    message = (
      <>
        Вашият IP адрес <Quotes>{ip}</Quotes> e от {countryName}.{" "}
        {countryIpText}
      </>
    );
  } else if (status === "missing_city_header") {
    message = (
      <>
        Не можем да разберем от кой град е IP адресът Ви. Той трябва да e от
        {" "}
        <Quotes>{cityFilter}</Quotes>.
      </>
    );
  } else if (status === "city_mismatch") {
    message = (
      <>
        Вашият IP адрес <Quotes>{ip}</Quotes> e от{" "}
        <Quotes>{city}</Quotes>, a трябва да e от <Quotes>{cityFilter}</Quotes>.
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
          subline={message}
        />
      }
    />
  );
}
