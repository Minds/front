import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'friendlytime',
})
export class FriendlyTimePipe {
  /**
   * Amount of seconds to transform from.
   * @param { number } seconds - seconds to transform into value.
   * @param precise - whether to use precise time or not, rather than humanized time - e.g.
   * if humazied, 45 seconds would display as "a minute".
   * @returns { string } time string - e.g. "in 30 days".
   */
  transform(seconds: number, precise: boolean = false): string {
    if (precise) {
      moment.relativeTimeThreshold('y', 365);
      moment.relativeTimeThreshold('d', 31);
      moment.relativeTimeThreshold('h', 24);
      moment.relativeTimeThreshold('m', 60);
      moment.relativeTimeThreshold('s', 60);
      moment.relativeTimeThreshold('ss', 60);
    }

    return moment(seconds * 1000).fromNow();
  }
}
