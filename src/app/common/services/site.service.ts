import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { proRoutes } from '../../modules/pro/pro.routes';
import { ConfigsService } from './configs.service';
import { IsTenantService } from './is-tenant.service';

@Injectable()
export class SiteService {
  get pro() {
    return this.configs.get('pro');
  }

  get isProDomain(): boolean {
    return Boolean(this.pro);
  }

  get title(): string {
    if (this.isProDomain) {
      return this.pro.title || '';
    } else if (this.isTenant.is()) {
      return this.configs.get('site_name');
    } else {
      return 'Minds';
    }
  }

  get oneLineHeadline(): string {
    return this.isProDomain ? this.pro.one_line_headline || '' : '';
  }

  get baseUrl(): string {
    return this.configs.get('site_url');
  }

  private router$: Subscription;

  constructor(
    private router: Router,
    private configs: ConfigsService,
    private isTenant: IsTenantService
  ) {}

  listen(): void {
    this.router$ = this.router.events.subscribe(
      (navigationEvent: NavigationEnd) => {
        try {
          if (navigationEvent instanceof NavigationEnd) {
            if (!navigationEvent.urlAfterRedirects) {
              return;
            }

            let url = navigationEvent.url
              .substring(1, navigationEvent.url.length)
              .split('/')[0]
              .split(';')[0]
              .split('?')[0];

            if (!this.searchRoutes(url, proRoutes)) {
              window.open(this.baseUrl + url, '_blank');
            }
          }
        } catch (e) {
          console.error('Minds: router hook(SearchBar)', e);
        }
      }
    );
  }

  private searchRoutes(url: string, routes: Array<string>): boolean {
    for (let route of routes) {
      if (route.includes(url)) {
        return true;
      }
    }

    return false;
  }

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
