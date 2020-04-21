import { Pipe } from '@angular/core';

@Pipe({
  name: 'token',
})
export class TokenPipe {
  transform(number: number | string, decimals: number = 18) {
    if (typeof number === 'string') {
      number = parseFloat(number);
    }

    decimals = Math.pow(10, decimals);
    return number / decimals;
  }
}
