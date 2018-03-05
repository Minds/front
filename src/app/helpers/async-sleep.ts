export default function asyncSleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
