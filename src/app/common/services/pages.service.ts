import { Injectable } from '@angular/core';

/**
 * Shared logic between internal 'p/' page loading components.
 * e.g. header, footer.
 *
 * @author Ben Hayward
 */
@Injectable()
export class PagesService {
  private internalPageRegex: RegExp = /^\/?p\/./; // matches 'p/' in first and second position.

  constructor() {}

  /**
   * Determines whether or not the link given is an internal page or external link.
   * @param { string } path - the path to be checked.
   *
   * @returns {boolean } true if regex matches that of an internal page 'p/[name]'.
   */
  public isInternalLink(path: string): boolean {
    return new RegExp(this.internalPageRegex).test(path);
  }
}
