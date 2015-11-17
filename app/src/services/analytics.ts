import { Inject, Injector, bind } from 'angular2/angular2';

export class AnalyticsService {

  //Set the analytics id of the page we want to send data
  id : string = "UA-70134683-1";

  constructor(){
    //we instantiate the google analytics service
    window.ga('create', this.id, 'auto');
  }

  //Manual send
  send(type : string){
    if (window.ga)
      window.ga('send', type);
  }
}
