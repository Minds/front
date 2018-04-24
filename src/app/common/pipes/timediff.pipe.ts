import { Pipe } from '@angular/core';

@Pipe({
  name: 'timediff'
})
export class TimediffPipe {
  transform(time: number, displaySeconds: boolean = false) {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);

    let output = '';

    if (hours > 0) {
      output += `${hours}h `;
    }

    if (minutes > 0 || !displaySeconds) {
      output += `${minutes}m `;
    }

    if (displaySeconds) {
      output += `${seconds}s`;
    }

    return output;
  }
}
