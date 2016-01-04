import { Component, Inject, Injector, bind } from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  directives: [ ROUTER_DIRECTIVES ]
})
export class AnalyticsService {

  //Set the analytics id of the page we want to send data
  id : string = "UA-35146796-1";

  constructor(public router: Router){
    //we instantiate the google analytics service
    window.ga('create', this.id, 'auto');

    //We set the router to call onRouteChanged every time we change the page
    this.router.subscribe(this.onRouteChanged);
  }

  onRouteChanged(path){
    //should we send more data?
    window.ga('send', 'pageview', { 'page' : path});
  }

  //Manual send.
  static send(type : string){
    if (window.ga)
      window.ga('send', type);
  }
}
