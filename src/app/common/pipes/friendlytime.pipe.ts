import { Pipe } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'friendlytime',
})
export class FriendlyTimePipe {
  transform(seconds: number): string {
    return moment(seconds * 1000).fromNow();
  }
}
