import { checkProd, getHost } from "🛠️/host.ts";
import { Poll } from "🛠️/types.ts";

const CF_IP_HEADER = "cf-connecting-ip";
const CF_IP_COUNTRY_HEADER = "cf-ipcountry";
const CF_IP_CITY_HEADER = "cf-ipcity";
const CF_COUNTRY_UNKNOWN = "XX";
const CF_IP_TOR = "T1";
const CF_RAY_HEADER = "cf-ray";

const COUNTRY_FILTER_ENABLED = false;

export interface VoteRequestCheck {
  ip: string;
  cfray: string;
  countryCode: string | null;
  city: string | null;
  cityFilter: string;
  status:
    | "ok"
    | "missing_ip_header"
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
  const isProd = checkProd();
  const locale = getHost().locale;

  const check: VoteRequestCheck = {
    status: "ok",
    ip: req.headers.get(CF_IP_HEADER) || "",
    cfray: req.headers.get(CF_RAY_HEADER) || "",
    countryCode: req.headers.get(CF_IP_COUNTRY_HEADER),
    city: req.headers.get(CF_IP_CITY_HEADER),
    cityFilter: poll.ipCityFilter,
  };

  if (!isProd) return check;

  if (!check.ip) {
    check.status = "missing_ip_header";
  } else if (!check.countryCode) {
    check.status = "missing_country_header";
  } else if (check.countryCode === CF_COUNTRY_UNKNOWN) {
    check.status = "country_unknown";
  } else if (check.countryCode === CF_IP_TOR) {
    check.status = "tor";
  } else if (
    COUNTRY_FILTER_ENABLED &&
    check.countryCode.toLowerCase() !== locale?.toLowerCase()
  ) {
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
