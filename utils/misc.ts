export function isNumeric(str: unknown) {
  if (typeof str !== "string") return false;
  return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
}

export function roundDownTo(roundTo: number) {
  return (x: number) => Math.floor(x / roundTo) * roundTo;
}

export const roundDownTo5Minutes = roundDownTo(1000 * 60 * 5);
