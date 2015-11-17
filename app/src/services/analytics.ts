import { Component, Inject, Injector, bind } from 'angular2/angular2';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  directives: [ ROUTER_DIRECTIVES ]
})
export class AnalyticsService {

  //Set the analytics id of the page we want to send data
  id : string = "UA-70134683-1";

  constructor(public router: Router){
    //we instantiate the google analytics service
    window.ga('create', this.id, 'auto');
    this.router.subscribe(this.onRouteChanged);
  }

  onRouteChanged(path){
    //should we send more data?
    window.ga('send', 'pageview', { 'page' : path});
  }

  //Manual send
  send(type : string){
    if (window.ga)
      window.ga('send', type);
  }
}
