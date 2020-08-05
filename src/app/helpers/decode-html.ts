/**
 * Decode a strings html entities.
 * Taken from advice given at https://stackoverflow.com/a/34064434/7396007
 * by users Wladimir Palant and vsync
 *
 * @param { string } input - String to transform.
 * @returns { string } - The decoded string.
 */
export default function htmlDecode(input: string): string {
  var doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}
