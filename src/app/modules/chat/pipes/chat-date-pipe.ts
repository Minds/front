import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * Transformation pipe for turning timestamps into human readable
 * dates for the chat system.
 */
@Pipe({
  name: 'chatDate',
  standalone: true,
})
export class ChatDatePipe implements PipeTransform {
  /**
   * Transform a timestamp into a human readable date.
   * @param { string | number } timestamp - timestamp to transform.
   * @param { boolean } short - whether the format should be shortened.
   * The longer format provides additional resolution.
   * @returns { string } - human readable chat date string.
   */
  transform(value: string | number, short: boolean = true): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      value = parseInt(value);
    }

    let date = moment.unix(value);

    if (date.clone().startOf('day').isSame(moment().clone().startOf('day'))) {
      return date.format('h:mma');
    }

    if (date.clone().startOf('year').isSame(moment().clone().startOf('year'))) {
      return date.format(short ? 'MMM DD' : 'MMM DD h:mma');
    }

    return date.format(short ? 'MMM D YYYY' : 'MMM D YYYY h:mma');
  }
}
