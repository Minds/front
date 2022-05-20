/**
 * @returns { bool } whether the browser is the Brave browser or not
 */
export default function isBrave() {
  try {
    // @ts-ignore
    if (window.navigator.brave != undefined) {
      // @ts-ignore
      if (window.navigator.brave.isBrave.name === 'isBrave') {
        return true;
      }
    }

    return false;
  } catch (e) {
    return false;
  }
}
