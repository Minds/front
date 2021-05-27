import { Pipe } from '@angular/core';

/**
 * Filesize pipe - will convert byte values into the highest possible whole filesize denomination.
 */
@Pipe({
  name: 'filesize',
})
export class FileSizePipe {
  /**
   * Transform byte values into highest possible whole filesize denomination.
   * @param { number } bytes - bytes value to convert.
   * @returns { string } user friendly string.
   */
  public transform(bytes: number): string {
    return this.formatBytes(bytes);
  }

  /**
   * Formats bytes and closest whole value. e.g. 100000 bytes becomes 1MB.
   * Adapter to TS from https://stackoverflow.com/a/18650828/7396007
   * @param { number } bytes - bytes value
   * @param { decimals } decimals - decimals to format to.
   * @returns  { string } formatted bytes into readable string.
   */
  private formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
