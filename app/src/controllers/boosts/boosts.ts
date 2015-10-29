import { Component, View, CORE_DIRECTIVES, EventEmitter} from 'angular2/angular2';
import { ROUTER_DIRECTIVES, RouteParams } from "angular2/router";
import { Client } from 'src/services/api';
import { Material } from 'src/directives/material';
import { CARDS } from 'src/controllers/cards/cards';

@Component({
  selector: 'minds-boosts-console',
  providers: [ Client ]
})
@View({
  templateUrl: 'src/controllers/boosts/boosts.html',
  directives: [ CORE_DIRECTIVES, Material, ROUTER_DIRECTIVES, CARDS]
})

export class Boosts{

  minds : Minds = window.Minds;
  _done: EventEmitter = new EventEmitter();

  type : string = "peer";
  filter : string = "inbox"
  offset : string = "";
  inProgress : boolean = false;
  moreData : boolean = true;
  error : string = "";

  boosts : Array<any> = [];

  constructor(public client: Client, params: RouteParams){
    if(params.params['filter'])
      this.filter = params.params['filter'];
    this.getBoosts();
  }

  getBoosts(){
    if(this.inProgress)
      return;
    this.inProgress = true;
    this.client.get('api/v1/boost/' + this.type + '/' + this.filter, {limit: 12, offset: this.offset})
      .then((response: any) => {
        if(!response.boosts || response.boosts.length == 0){
          this.inProgress = false;
          this.moreData = false;
          return false;
        }
        console.log(response);
        this.boosts = this.boosts.concat(response.boosts);
        this.offset = response['load-next'];
        this.inProgress = false;
        this.moreData = true;
      })
      .catch((e) => {
        this.inProgress = false;
        this.moreData = false;
        this.error = e.message;
      })
  }


}
