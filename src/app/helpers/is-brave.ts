export default function isBrave() {
  // @ts-ignore
  if (window.navigator.brave != undefined) {
    // @ts-ignore
    if (window.navigator.brave.isBrave.name == 'isBrave') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
