/**
 * Truncate a string to a given length, appending it with ellipsis if it goes over the maximum length.
 * The total length with ellipsis will be the maximum length.
 * @param { string } string - The string to truncate.
 * @param { number } maxLength - Maximum length of the string before it will be truncated.
 * @returns { string } The truncated string.
 */
export default function truncateString(
  string: string,
  maxLength: number
): string {
  if (string.length > maxLength) {
    string = string.substring(0, maxLength - 3) + '...';
  }
  return string;
}
