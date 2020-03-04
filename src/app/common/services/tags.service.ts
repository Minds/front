import { Injectable } from '@angular/core';

/**
 * Tags service, contains regex used in hashtag detection.
 */
@Injectable()
export class TagsService {
  private regex: Object = {
    url: /(\b(https?|ftp|file):\/\/[^\s\]]+)/gim,
    mail: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gim,
    hash: /(^|\s||)#(\w+)/gim,
    at: /(^|\W|\s)@([a-z0-9_\-\.]+[a-z0-9_])/gim,
  };

  /**
   * Get regex for url, mail, hash or at.
   */
  public getRegex(key: string): RegExp {
    return this.regex[key];
  }
}
