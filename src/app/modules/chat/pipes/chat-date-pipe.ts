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
  transform(value: string | number): any {
    if (!value) {
      return value;
    }

    if (typeof value === 'string') {
      value = parseInt(value);
    }

    let date = moment.unix(value);

    if (
      date
        .clone()
        .startOf('day')
        .isSame(
          moment()
            .clone()
            .startOf('day')
        )
    ) {
      return date.format('h:mma');
    }

    if (
      date
        .clone()
        .startOf('year')
        .isSame(
          moment()
            .clone()
            .startOf('year')
        )
    ) {
      return date.format('MMM DD');
    }

    return date.format('MMM D YYYY');
  }
}
