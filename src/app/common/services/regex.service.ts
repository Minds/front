import { Injectable } from '@angular/core';

/**
 * Contains different common regex expressions for shared quick access.
 */
@Injectable()
export class RegexService {
  private regex: Object = {
    url: /(\b(https?|ftp|file):\/\/[^\s\]]+(?:[^!?\s]))/gim,
    mail: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gim,
    hash: new RegExp(
      [
        '([^&]|\\b|^)', // Start of string, and word bounday. Not if preceeded by & symbol
        '#', //
        '([',
        '\\wÀ-ÿ', // All Latin words + accented characters
        '\\u0E00-\\u0E7F', // Unicode range for Thai
        '\\u2460-\\u9FBB', // Unicode range for Japanese but may be overly zealous
        ']+)',
      ].join(''),
      'gim' // Global, Case insensitive, Multiline
    ), //
    cash: new RegExp(
      [
        '([^&]|\\b|^)', // Start of string, and word bounday. Not if preceeded by & symbol
        '\\$', //
        '([',
        'A-Za-z',
        ']+)',
      ].join(''),
      'gim' // Global, Case insensitive, Multiline
    ), //
    at: /(^|\W|\s)@([a-z0-9_\-\.]+[a-z0-9_](?:@([a-z0-9_\-]+\.[a-z]{2,}(\.[a-z]{2,})?))?)\b/gim,
  };

  /**
   * Get regex for url, mail, hash or at.
   */
  public getRegex(key: string): RegExp {
    return this.regex[key];
  }
}
