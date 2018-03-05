function toDec(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}

export default function randomString(len = 40) {
  const bytes = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(bytes);

  return Array.from(bytes, toDec).join('');
}
