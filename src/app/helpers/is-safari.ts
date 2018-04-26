export default function isSafari() {
  return !!((<any> window).safari || /^((?!chrome|android).)*safari/i.test(navigator.userAgent));
}
