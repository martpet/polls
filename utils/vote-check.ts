import { checkIsProd, getHostInfo } from "🛠️/host.ts";
import { Poll } from "🛠️/types.ts";

const IP_HEADER = "cf-connecting-ip";
const IP_COUNTRY_HEADER = "cf-ipcountry";
const IP_CITY_HEADER = "cf-ipcity";
const CF_COUNTRY_UNKNOWN = "XX";
const CF_IP_TOR = "T1";

export interface VoteRequestCheck {
  ip: string | null;
  countryCode: string | null;
  city: string | null;
  cityFilter: string;
  status:
    | "good"
    | "missing_country_header"
    | "missing_city_header"
    | "country_unknown"
    | "country_mismatch"
    | "city_mismatch"
    | "tor";
}

export default function checkVoteRequest(
  req: Request,
  poll: Poll,
): VoteRequestCheck {
  const isProd = checkIsProd();
  const localeCountry = getHostInfo().locale;

  const check: VoteRequestCheck = {
    status: "good",
    ip: req.headers.get(IP_HEADER),
    countryCode: req.headers.get(IP_COUNTRY_HEADER),
    city: req.headers.get(IP_CITY_HEADER),
    cityFilter: poll.ipCityFilter,
  };

  if (!isProd) return check;

  if (!check.countryCode) {
    check.status = "missing_country_header";
  } else if (check.countryCode === CF_COUNTRY_UNKNOWN) {
    check.status = "country_unknown";
  } else if (check.countryCode === CF_IP_TOR) {
    check.status = "tor";
  } else if (check.countryCode.toLowerCase() !== localeCountry?.toLowerCase()) {
    check.status = "country_mismatch";
  } else if (check.cityFilter) {
    if (!check.city) {
      check.status = "missing_city_header";
    } else if (check.city !== check.cityFilter) {
      check.status = "city_mismatch";
    }
  }

  return check;
}
