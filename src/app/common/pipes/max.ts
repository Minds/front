import { Pipe } from '@angular/core';

@Pipe({
  name: 'max',
})
export class MaxPipe {
  transform(num: number, limit: number) {
    return num > limit ? `+${limit}` : String(num);
  }
}
