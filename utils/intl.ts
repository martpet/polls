import * as ptera from "ptera";

import { getHost } from "🛠️/host.ts";

export function shortZonedDateFormat() {
  const { locale, timeZone } = getHost();
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
    timeZone,
  });
}

export function longZonedDateFormat() {
  const { locale, timeZone } = getHost();
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "full",
    timeZone,
  });
}

export function getCollator() {
  const { locale } = getHost();
  return new Intl.Collator(locale);
}

export function getCountryName(countryCode: string) {
  const { locale } = getHost();
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });
  return regionNames.of(countryCode);
}

export function dateFromLocalDateString(date: Date) {
  const { timeZone: timezone } = getHost();
  return ptera.datetime(date, { timezone }).toJSDate();
}

export function dateToLocalDateString(date: Date) {
  const { timeZone: timezone } = getHost();
  const FORM_INPUT_FORMAT = "YYYY-MM-dTHH:mm:ss";
  return ptera.datetime(date).toZonedTime(timezone).format(FORM_INPUT_FORMAT);
}
