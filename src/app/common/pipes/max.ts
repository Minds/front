import { Pipe } from '@angular/core';
import maxNum from '../../helpers/max';

/**
 * Used to limit a number to a max value
 * e.g. [input]="150 | max: 99" => "+99"
 */
@Pipe({
  name: 'max',
})
export class MaxPipe {
  transform(num: number, limit: number) {
    return maxNum(num, limit);
  }
}
