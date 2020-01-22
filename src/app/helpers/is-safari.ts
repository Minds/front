export function isSafari() {
  return !!(
    (<any>window).safari ||
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  );
}

export function iOSVersion() {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
  } else {
    return null;
  }
}
