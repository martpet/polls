import { checkIsProd, getHost, getLocale } from "🛠️/host.ts";

function basePart() {
  return checkIsProd() ? getLocale() : getHost();
}

export class Db extends Deno.Kv {
  constructor() {
  }
  override get<T = unknown>(
    key: Deno.KvKey,
    options?: { consistency?: Deno.KvConsistencyLevel },
  ): Promise<Deno.KvEntryMaybe<T>> {
    return super.get([basePart(), ...key], options);
  }
}
