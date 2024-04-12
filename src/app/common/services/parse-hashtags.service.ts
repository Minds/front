import { Injectable } from '@angular/core';
import { RegexService } from './regex.service';

/**
 * Parse hashtags from a string.
 */
@Injectable({ providedIn: 'root' })
export class HashtagsFromStringService {
  constructor(private regex: RegexService) {}

  /**
   * Parse hashtags from a string, stripping away any leading #.
   * @param { string } value - string to be parsed.
   * @returns { string[] } - array of tags without leading #.
   */
  public parseHashtagsFromString(value: string): string[] {
    if (!value) {
      return [];
    }

    value = this.stripUrls(value);

    return (
      value.match(this.regex.getRegex('hash'))?.map((tag) => {
        tag = tag.trim();

        return tag.charAt(0) === '#' ? tag.substr(1) : tag;
      }) ?? []
    );
  }

  /**
   * Parse cashtags from a string, stripping away any leading $.
   * @param { string } value - string to be parsed.
   * @returns { string[] } - array of tags without leading $.
   */
  public parseCashtagsFromString(value: string): string[] {
    if (!value) {
      return [];
    }

    value = this.stripUrls(value);

    return (
      value.match(this.regex.getRegex('cash'))?.map((tag) => {
        tag = tag.trim();

        return tag.charAt(0) === '#' ? tag.substr(1) : tag;
      }) ?? []
    );
  }

  /**
   * Strip urls.
   * @param value dirty url.
   * @returns { string } url cleaned of URLs
   */
  private stripUrls(value: string): string {
    return value.replace(this.regex.getRegex('url'), '');
  }
}
