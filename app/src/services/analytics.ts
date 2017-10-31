import { Component, Inject, Injector } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Client } from './api/client';

export class AnalyticsService {

  //Set the analytics id of the page we want to send data
  id: string = 'UA-35146796-1';

  private defaultPrevented: boolean = false;

  //Manual send.
  static send(type: string, fields: any = {}) {
    if (window.ga) {
      window.ga('send', type, fields);
    }
  }

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

  send(type: string, fields: any = {}, entityGuid: string) {
    if (window.ga) {
      window.ga('send', type, fields);
    }
    this.client.post('api/v1/analytics', { type, fields, entityGuid });
  }

  onRouterInit() {
    //we instantiate the google analytics service
    window.ga('create', this.id, 'auto');
  }

  onRouteChanged(path) {
    if (!this.defaultPrevented) {
      AnalyticsService.send('pageview', { 'page': path });
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
