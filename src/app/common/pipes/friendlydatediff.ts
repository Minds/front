import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'friendlydatediff',
})
export class FriendlyDateDiffPipe implements PipeTransform {
  transform(
    value: string | number,
    reference: string | number = null,
    displaySuffix: boolean = false
  ): any {
    if (!value) {
      return value;
    }

    if (typeof value === 'string') {
      value = parseInt(value);
    }

    const suffix = displaySuffix ? ' ago' : '';

    let afterDate = moment();

    if (reference) {
      if (typeof reference === 'string') {
        reference = parseInt(reference);
      }
      afterDate = moment.unix(reference);
    }

    let beforeDate = moment.unix(value);

    const diffYears = afterDate.diff(beforeDate, 'years');
    const diffDays = afterDate.diff(beforeDate, 'days');
    const diffHours = afterDate.diff(beforeDate, 'hours');
    const diffMins = afterDate.diff(beforeDate, 'minutes');
    let diffSecs = afterDate.diff(beforeDate, 'seconds');

    if (diffYears > 0) {
      return beforeDate.format('MMM D YYYY');
    }

    if (diffDays > 0) {
      return beforeDate.format('MMM D');
    }

    if (diffHours > 0) {
      return `${diffHours}h${suffix}`;
    }

    if (diffMins > 0) {
      return `${diffMins}m${suffix}`;
    }

    if (diffSecs < 0) {
      diffSecs = 0;
    }

    return `${diffSecs}s${suffix}`;
  }
}
