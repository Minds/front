/**
 * Whether the current browser is Firefox.
 * @returns { boolean } - True when the current browser is Firefox.
 */
export function isFirefox(): boolean {
  return navigator.userAgent.indexOf('Firefox') > -1;
}
