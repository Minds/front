import { Pipe } from '@angular/core';

@Pipe({
  name: 'token'
})
export class TokenPipe {
  transform(number: number, decimals: number = 18) {
    decimals = Math.pow(10, decimals);
    return number / decimals;
  }
}
