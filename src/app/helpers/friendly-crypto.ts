import * as BN from 'bn.js';
// *
// Convert really long crypto values into friendly numbers
// *
// Notes:
// Assumes input currency has 18 decimal places
// Decimals are *not* rounded up
// No decimals will be returned if decimal value is 0

export default function toFriendlyCryptoVal(
  longCryptoVal: number | string,
  decimalCount?: number // how many decimals you want to be returned
) {
  decimalCount = decimalCount || 3;
  decimalCount = decimalCount > 17 ? 17 : decimalCount;
  decimalCount = decimalCount < 0 ? 0 : decimalCount;

  console.log(longCryptoVal);
  const longVal = new BN(longCryptoVal.toString());
  const friendlyCryptoVal =
    longVal.div(new BN(10).pow(new BN(18 - decimalCount))).toNumber() /
    Math.pow(10, decimalCount);

  console.log('friendly', friendlyCryptoVal);

  return friendlyCryptoVal;
}
