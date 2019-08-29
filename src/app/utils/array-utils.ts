export function findLastIndex<T>(
  arr: T[],
  predicate: (this: T[], value: T, index: number, arr: T[]) => boolean
) {
  let key = arr.length - 1;

  while (key > -1) {
    let value = arr[key];

    if (predicate.call(arr, value, key, arr)) {
      return key;
    }

    key--;
  }

  return -1;
}
