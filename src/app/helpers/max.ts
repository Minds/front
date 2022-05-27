/**
 * returns a number and +limit if number was larger than limit
 */
export default function maxNum(num: number, limit = 99): string {
  return num > limit ? `+${limit}` : String(num);
}
