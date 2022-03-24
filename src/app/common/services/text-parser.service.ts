import { Injectable } from '@angular/core';
import * as twitterText from 'twitter-text';

// object containing url and indices with position 0 being the start and
export type UrlWithIndices = {
  indices: number[];
  url: string;
};

/**
 * Helper functions to parse content like URLs from text.
 */
@Injectable({ providedIn: 'root' })
export class TextParserService {
  /**
   * Extracts URLs with their indices.
   * @param { string } text - content to extract urls from.
   * @returns { UrlWithIndices[] } - array of urls with their indices.
   */
  public extractUrlsWithIndices(text: string): UrlWithIndices[] {
    return twitterText.default.extractUrlsWithIndices(text, {
      extractUrlsWithoutProtocol: true,
    });
  }

  /**
   * Extracts URLs.
   * @param { string } text - content to extract urls from.
   * @returns { string } - array of urls.
   */
  public extractUrls(text: string): string[] {
    return twitterText.default.extractUrls(text, {
      extractUrlsWithoutProtocol: true,
    });
  }

  /**
   * Forces HTTPS if no http or https protocol is specified. This is useful
   * because our iframe provider does not respect meta-tag provided
   * canonical URLs when parsing, and will convert URLs without protocol
   * to standard http.
   *
   * If a website does not have SSL, this means we will only be able to
   * generate a preview if the protocol is specified.
   *
   * Usage is left up to the implementation on whether to use this function.
   *
   * @param { string } url - the URL to prepend https to if needed.
   * @return { string } - https prepended URL.
   */
  public prependHttps(url: string): string {
    return url.startsWith('http') ? url : `https://${url}`;
  }
}
