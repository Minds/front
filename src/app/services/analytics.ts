import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Client } from './api/client';
import { SiteService } from '../common/services/site.service';
import { isPlatformServer } from '@angular/common';
import { delay } from 'rxjs/operators';

export type SnowplowContext = {
  schema: string;
  data: Object;
};

@Injectable()
export class AnalyticsService {
  private defaultPrevented: boolean = false;

  contexts: SnowplowContext[] = [];

  static _(
    router: Router,
    client: Client,
    site: SiteService,
    platformId: Object
  ) {
    return new AnalyticsService(router, client, site, platformId);
  }

  constructor(
    @Inject(Router) public router: Router,
    @Inject(Client) public client: Client,
    @Inject(SiteService) public site: SiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initSnowplow();

    this.onRouterInit();

    this.router.events.subscribe(navigationState => {
      if (navigationState instanceof NavigationEnd) {
        try {
          this.onRouteChanged(navigationState.urlAfterRedirects);
        } catch (e) {
          console.error('Minds: router hook(AnalyticsService)', e);
        }
      }
    });
  }

  initSnowplow() {
    if (isPlatformServer(this.platformId)) return;
    const snowplowUrl = '//sp.minds.com';
    //const snowplowUrl = `//localhost:8090`;
    (window as any).snowplow('newTracker', 'ma', snowplowUrl, {
      appId: 'minds',
      postPath: '/com.minds/t',
    });
    (window as any).snowplow('enableActivityTracking', {
      minimumVisitLength: 30,
      heartbeatDelay: 10,
    });
  }

  async send(type: string, fields: any = {}, entityGuid: string = null) {
    if (isPlatformServer(this.platformId)) return; // Client side does these. Don't call twice
    if (type === 'pageview') {
      this.client.post('api/v2/mwa/pv', fields);

      (window as any).snowplow('trackPageView', {
        context: this.contexts.length > 0 ? this.contexts.slice(0) : undefined,
      });
    } else {
      this.client.post('api/v1/analytics', { type, fields, entityGuid });
    }
  }

  async onRouterInit() {}

  onRouteChanged(path) {
    if (!this.defaultPrevented) {
      let url = path;

      if (this.site.isProDomain) {
        url = `/pro/${this.site.pro.user_guid}${url}`;
      }

      this.send('pageview', {
        url,
        referrer: document.referrer,
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
