import { Component, Inject, Injector } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

export class AnalyticsService {

  //Set the analytics id of the page we want to send data
  id : string = "UA-35146796-1";

  constructor(@Inject(Router) public router: Router){
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

  onRouterInit() {
    //we instantiate the google analytics service
    window.ga('create', this.id, 'auto');
  }

  onRouteChanged(path){
    //should we send more data?
    window.ga('send', 'pageview', { 'page' : path});
  }

  //Manual send.
  static send(type : string, opts : any = {}){
    if (window.ga)
      window.ga('send', type, {});
  }
}
