import { Pipe } from '@angular/core';

/**
 * Used to limit a number to a max value
 * e.g. [input]="150 | max: 99" => "+99"
 */
@Pipe({
  name: 'max',
})
export class MaxPipe {
  transform(num: number, limit: number) {
    return num > limit ? `+${limit}` : String(num);
  }
}
