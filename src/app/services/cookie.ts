import { CookieService } from '@gorniv/ngx-universal';
import { Injectable } from '@angular/core';

/**
 * A very simple cookie service
 */
@Injectable()
export class Cookie {
  constructor(private cookieService: CookieService) {}

  /**
   * Return a cookie by name
   */
  get(key: string): string {
    return this.cookieService.get(key);
    // var cookies: Array<string> = document.cookie
    //   ? document.cookie.split('; ')
    //   : [];

    // if (!cookies) return;

    // for (let cookie of cookies) {
    //   let name: string, value: string;
    //   [name, value] = cookie.split('=');
    //   if (name === key) return value;
    // }
    // return;
  }
}
