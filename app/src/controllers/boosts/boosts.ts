import { Component, View, EventEmitter} from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, RouteParams } from "angular2/router";

import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';
import { Material } from '../../directives/material';
import { CARDS } from '../../controllers/cards/cards';
import { BUTTON_COMPONENTS } from '../../components/buttons';


@Component({
  selector: 'minds-boosts-console',
  providers: [ Client ]
})
@View({
  templateUrl: 'src/controllers/boosts/boosts.html',
  directives: [ CORE_DIRECTIVES, Material, ROUTER_DIRECTIVES, CARDS, BUTTON_COMPONENTS]
})

export class Boosts{

  minds : Minds = window.Minds;
  session  = SessionFactory.build();
  _done: EventEmitter<any> = new EventEmitter();

  type : string = "peer";
  filter : string = "inbox"
  offset : string = "";
  inProgress : boolean = false;
  moreData : boolean = true;
  error : string = "";

  boosterToggle : boolean = false;
  boosterToggleInProgress : boolean = false;
  latestPosts = [];
  latestMedia = [];

  boosts : Array<any> = [];

  constructor(public client: Client, params: RouteParams){
    if(params.params['filter'])
      this.filter = params.params['filter'];
    if(params.params['type'])
      this.type = params.params['type'];
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

  accept(boost, i){
    this.boosts[i].state = 'accepted';
    this.client.put('api/v1/boost/peer/' + boost.guid)
      .catch(e => {
        this.boosts[i].state = 'created';
      });
  }

  reject(boost, i){
    this.boosts[i].state = 'rejected';
    this.client.delete('api/v1/boost/peer/' + boost.guid)
      .catch(e => {
        this.boosts[i].state = 'created';
      });
  }

  loadLatestPosts(){
    this.client.get('api/v1/newsfeed/personal')
      .then((response : any) => {
        this.latestPosts = response.activity;
        this.boosterToggleInProgress = false;
      });
  }

  loadLatestMedia(){
    this.client.get('api/v1/entities/owner')
      .then((response : any) => {
        this.latestMedia = response.entities;
        this.boosterToggleInProgress = false;
      });
  }

  setBoostToggle(toggle : boolean = true){
    this.boosterToggle = toggle;
    this.boosterToggleInProgress = true;
    if(toggle){
      this.loadLatestPosts();
      this.loadLatestMedia();
    }
  }

  boostContent(e){
    if (!e) e = window.event;
      e.cancelBubble = true;
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    return true;
  }

}
