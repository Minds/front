import { Pipe } from '@angular/core';

/**
 * Pipe to handle the formatting of audio timestamps.
 */
@Pipe({
  name: 'audioTime',
  standalone: true,
})
export class AudioTimePipe {
  /**
   * Transform the timestamp to a formatted string.
   * @param { number } time - The timestamp to format.
   * @returns { string } The formatted string.
   */
  transform(time: number): string {
    const seconds: number = Math.floor(time % 60);
    const minutes: number = Math.floor(time / 60) % 60;
    const hours: number = Math.floor(time / 3600);

    let output: string = '';

    if (hours > 0) {
      output += `${hours}:${minutes.toString().padStart(2, '0')}:`;
    } else if (minutes > 0) {
      output += `${minutes}:`;
    } else {
      output += '0:';
    }

    output += `${seconds.toString().padStart(2, '0')}`;

    return output;
  }
}
