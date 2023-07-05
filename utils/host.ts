import { associateBy } from "$std/collections/associate_by.ts";

const MAIN_HOST = "glasuvane.com";
const DEMO_HOST = "polls.deno.dev";

const currentHost = { value: "" };
const prodHosts = [MAIN_HOST] as const;

export type ProdHost = typeof prodHosts[number];

interface HostInfo {
  host: ProdHost;
  locale: string;
  phoneCode: `+${string}`;
  timeZone: `${string}/${string}`;
}

const data: HostInfo[] = [
  {
    host: "glasuvane.com",
    locale: "bg",
    phoneCode: "+359",
    timeZone: "Europe/Sofia",
  },
];

const dataByHost = associateBy(data, (it) => it.host) as Record<
  ProdHost,
  HostInfo
>;

export function setHost(host: string) {
  currentHost.value = host;
}

export function getHost() {
  if (!currentHost.value) throw new Error("Missing host value");
  return currentHost.value;
}

export function getHostInfo() {
  return dataByHost[getHost() as ProdHost] || dataByHost[MAIN_HOST];
}

export function getLocale() {
  return getHostInfo().locale;
}

export function checkIsProd() {
  return prodHosts.includes(getHost() as ProdHost);
}

export function checkIsDemo() {
  return getHost() === DEMO_HOST;
}
