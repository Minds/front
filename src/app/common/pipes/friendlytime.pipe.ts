import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'friendlytime',
})
export class FriendlyTimePipe {
  transform(seconds: number): string {
    return moment(seconds * 1000).fromNow();
  }
}
