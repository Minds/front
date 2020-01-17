import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { proRoutes } from '../../modules/pro/pro.routes';

@Injectable()
export class SiteService {
  get pro() {
    return window.Minds.pro;
  }

  get isProDomain(): boolean {
    return Boolean(this.pro);
  }

  get title(): string {
    return this.isProDomain ? this.pro.title || '' : 'Minds';
  }

  get oneLineHeadline(): string {
    return this.isProDomain ? this.pro.one_line_headline || '' : '';
  }

  get baseUrl(): string {
    return window.Minds.site_url; // TODO: use SSR once merged in
  }

  private router$: Subscription;

  constructor(private router: Router) {
    if (this.isProDomain) {
      this.listen();
    }
  }

  private listen() {
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
              window.open(window.Minds.site_url + url, '_blank');
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
}
