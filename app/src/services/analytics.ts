import { Inject, Injector, bind } from 'angular2/angular2';

export class AnalyticsService {

  ga : any;
  id : string = "UA-70134683-1";

  constructor(){
    console.log("constructing AnalyticsService");
    window.Minds.ga=window.Minds.ga||function(){(ga.q=ga.q||[]).push(arguments)};
    window.Minds.ga.l=+new Date;
    window.Minds.ga('create', this.id, 'auto');
    console.log(window.Minds.ga);
  }

  send(type : string){
    console.log("sending");
    window.Minds.ga('send', type);
  }
}
