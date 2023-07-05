export function isNumeric(str: unknown) {
  if (typeof str !== "string") return false;
  return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
}
