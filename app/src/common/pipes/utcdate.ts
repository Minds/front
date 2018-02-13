/**
 * Credits to Jo Paul (https://stackoverflow.com/a/43281084)
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {

  transform(value: string | number): any {

    if (!value) {
      return '';
    }

    const dateValue = new Date(<string>value);

    const dateWithNoTimezone = new Date(
      dateValue.getUTCFullYear(),
      dateValue.getUTCMonth(),
      dateValue.getUTCDate(),
      dateValue.getUTCHours(),
      dateValue.getUTCMinutes(),
      dateValue.getUTCSeconds(),
      dateValue.getUTCMilliseconds()
    );

    return dateWithNoTimezone;
  }
}
