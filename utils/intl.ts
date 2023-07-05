import * as ptera from "ptera";

import { getHostInfo } from "🛠️/host.ts";

export function shortZonedDateFormat() {
  const { locale, timeZone } = getHostInfo();
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
    timeZone,
  });
}

export function longZonedDateFormat() {
  const { locale, timeZone } = getHostInfo();
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "full",
    timeZone,
  });
}

export function getCollator() {
  const { locale } = getHostInfo();
  return new Intl.Collator(locale);
}

export function getCountryName(countryCode: string) {
  const { locale } = getHostInfo();
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });
  return regionNames.of(countryCode);
}

export function getNumberFormat({ locale }: { locale?: string } = {}) {
  locale ??= getHostInfo().locale;
  return Intl.NumberFormat(locale);
}

export function dateFromLocalDateString(date: Date) {
  const { timeZone: timezone } = getHostInfo();
  return ptera.datetime(date, { timezone }).toJSDate();
}

export function dateToLocalDateString(date: Date) {
  const { timeZone: timezone } = getHostInfo();
  const FORM_INPUT_FORMAT = "YYYY-MM-dTHH:mm:ss";
  return ptera.datetime(date).toZonedTime(timezone).format(FORM_INPUT_FORMAT);
}
