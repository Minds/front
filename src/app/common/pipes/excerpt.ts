import { Pipe } from '@angular/core';

@Pipe({
  name: 'excerpt',
  standalone: false,
})
export class ExcerptPipe {
  transform(value: string, maxLength: number = 140) {
    if (!value || value.length <= maxLength) return value;

    return value.substring(0, maxLength) + '...';
  }
}
