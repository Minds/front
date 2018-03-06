import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Client } from './api/client';

@Injectable()
export class AnalyticsService {
  private defaultPrevented: boolean = false;

  static _(router: Router, client: Client) {
    return new AnalyticsService(router, client);
  }

  constructor(@Inject(Router) public router: Router, @Inject(Client) public client: Client) {
    this.onRouterInit();

    this.router.events.subscribe((navigationState) => {
      if (navigationState instanceof NavigationEnd) {
        try {
          this.onRouteChanged(navigationState.urlAfterRedirects);
        } catch (e) {
          console.error('Minds: router hook(AnalyticsService)', e);
        }
      }
    });
  }

  async send(type: string, fields: any = {}, entityGuid: string = null) {
    if (type === 'pageview') {
      this.client.post('api/v2/analytics/pageview', fields);
    } else {
      this.client.post('api/v1/analytics', { type, fields, entityGuid });
    }
  }

  async onRouterInit() {
  }

  onRouteChanged(path) {
    if (!this.defaultPrevented) {
      this.send('pageview', { 
        url: path,
        referrer: document.referrer
      });
    }

    this.defaultPrevented = false;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  wasDefaultPrevented() {
    return this.defaultPrevented;
  }


}
