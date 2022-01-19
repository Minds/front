import { Pipe, PipeTransform } from '@angular/core';

/**
 * Decodes a string with HTML entities.
 * Idea taken from https://stackoverflow.com/a/34064434
 */
@Pipe({ name: 'decodeHtmlString' })
export class DecodeHtmlStringPipe implements PipeTransform {
  /**
   * Transforms a string such that HTML entities are decoded.
   * @param { string } value - string to decode.
   * @returns { string } - decoded string.
   */
  public transform(value: string): string {
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.documentElement.textContent;
  }
}
