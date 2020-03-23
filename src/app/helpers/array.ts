/**
 * Splits an array into chunks and return them on an array
 * @param arr
 * @param chunkSize
 */
export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  return arr.length
    ? [arr.slice(0, chunkSize), ...chunkArray(arr.slice(chunkSize), chunkSize)]
    : [];
}
