import { Injectable } from '@angular/core';
import { Session } from '../../../services/session';
import { SiteService } from '../../../common/services/site.service';
import { SendWyreConfig } from './sendwyre.interface';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Service to handle redirection to SendWyre pay.
 * @author Ben Hayward
 */
@Injectable()
export class SendWyreService {
  // Amount to be purchased in USD.
  public amountUsd: string = '40';

  constructor(
    public session: Session,
    public site: SiteService,
    public configs: ConfigsService
  ) {}

  /**
   * Redirects to SendWyre.
   * @param { SendWyreConfig } sendWyreConfig - args for querystring.
   */
  public redirect(sendWyreConfig: SendWyreConfig): void {
    if (this.configs.get('sendwyre')['baseUrl']) {
      window.location.assign(this.getUrl(sendWyreConfig));
    } else {
      console.warn('SendWyre baseUrl not configured');
    }
  }

  /**
   * Gets the url.
   * @param { SendWyreConfig } args - config object.
   * @returns { string }.- the URL.
   */
  public getUrl(args: SendWyreConfig): string {
    return this.configs.get('sendwyre')['baseUrl'] + this.buildArgs(args);
  }

  /**
   * Builds query string from SendWyre config.
   * @param { SendWyreConfig } - config object.
   * @returns { string } - built query string e.g. ?foo=1&bar=2
   */
  private buildArgs(args: SendWyreConfig): string {
    let queryString = '?';
    for (let [key, value] of Object.entries(args)) {
      if (key && value) {
        queryString = queryString + `${key}=${value}&`;
      }
    }
    return queryString.substring(0, queryString.length - 1);
  }
}
