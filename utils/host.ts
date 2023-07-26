import { associateBy } from "$std/collections/associate_by.ts";

import { getEnv } from "🛠️/env.ts";

interface Host {
  hostname: string;
  locale: string;
  phoneCode: `+${string}`;
  timeZone: `${string}/${string}`;
  flag: string;
}

const DEFAULT_HOST: Host = {
  hostname: getEnv("BG_HOSTNAME"),
  locale: "bg",
  phoneCode: "+359",
  timeZone: "Europe/Sofia",
  flag: "🇧🇬",
};

const hosts = [DEFAULT_HOST];
const hostsByName = associateBy(hosts, (h) => h.hostname);
const hostnames = hosts.map(({ hostname }) => hostname);
const hostname = { current: "" };

export function setHostname(host: string) {
  hostname.current = host;
}

export function getHostname() {
  if (!hostname.current) throw new Error("Hostname is not set");
  return hostname.current;
}

export function getHost() {
  return hostsByName[getHostname()] || DEFAULT_HOST;
}

export function checkProd() {
  return hostnames.includes(getHostname());
}

export function checkDemo() {
  return getHostname() === "polls.deno.dev";
}
