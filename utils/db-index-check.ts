import { FormErrors } from "🛠️/forms.ts";

interface CheckIndexesOptions<T> {
  primaryKey: Deno.KvKey;
  uniqueIndexes?: Partial<Record<keyof T, Deno.KvKey>>;
  nonUniqueIndexes?: Partial<Record<keyof T, Deno.KvKey>>;
}
export default async function checkIndexes<T>(
  kv: Deno.Kv,
  options: CheckIndexesOptions<T>,
) {
  const { primaryKey, uniqueIndexes, nonUniqueIndexes } = options;
  const allIndexes = { ...uniqueIndexes, ...nonUniqueIndexes };
  const allFields = Object.keys(allIndexes) as (keyof T)[];
  const uniqueIndexesFields = Object.keys(uniqueIndexes || {});
  const secondaryKeys = Object.values(allIndexes) as Deno.KvKey[];
  const entries = await kv.getMany<T[]>([primaryKey, ...secondaryKeys]);
  const [primaryEntry, ...secondaryEntries] = entries;
  const primaryItem = primaryEntry.value;
  const duplicateFields: (keyof T)[] = [];
  const keysForRemoval: Deno.KvKey[] = [];
  allFields.forEach((fieldName, i) => {
    const isUniqueIndex = uniqueIndexesFields.includes(fieldName as string);
    const secondaryKey = secondaryKeys[i];
    const positionOfValueInKey = secondaryKey.length - (isUniqueIndex ? 1 : 2);
    const newVal = secondaryKey[positionOfValueInKey];
    const oldVal = primaryItem?.[fieldName];
    const secondaryItem = secondaryEntries[i].value;
    if (newVal !== oldVal) {
      if (!secondaryItem && oldVal !== undefined) {
        const key = [...secondaryKey];
        key[positionOfValueInKey] = oldVal as string;
        keysForRemoval.push(key);
      } else if (secondaryItem && isUniqueIndex) {
        duplicateFields.push(fieldName);
      }
    }
  });
  if (duplicateFields.length) {
    const errEntries = duplicateFields.map((f) => [f, ["uniqueness"]]);
    const uniqueFieldsErrors = Object.fromEntries(errEntries) as FormErrors<T>;
    return { uniqueFieldsErrors };
  }
  return { keysForRemoval };
}
