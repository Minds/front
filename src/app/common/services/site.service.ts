import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';
import { IsTenantService } from './is-tenant.service';

@Injectable()
export class SiteService {
  get title(): string {
    if (this.isTenant.is()) {
      return this.configs.get('site_name');
    } else {
      return 'Minds';
    }
  }

  get baseUrl(): string {
    return this.configs.get('site_url');
  }

  constructor(
    private configs: ConfigsService,
    private isTenant: IsTenantService
  ) {}

  /**
   * Returns the rel attribute for external links
   * @param { string } url
   * @returns { string } the rel attribute
   */
  getLinkRel(url: string) {
    const siteUrl = this.configs.get('site_url');
    // if the link was pointing to our website
    if (url.indexOf(siteUrl) === 0) return '';
    // don't follow links that aren't from our site
    return 'noopener noreferrer ugc nofollow';
  }
}
