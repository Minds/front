/**
 * Credit to https://stackoverflow.com/a/46455994
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit = 30,
    ellipsis = '...',
    completeWords = false
  ) {
    if (!value) {
      return '';
    }

    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
