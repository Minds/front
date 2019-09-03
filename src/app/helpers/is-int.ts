export default function isInt(value: number) {
  return value - Math.floor(value) === 0;
}
