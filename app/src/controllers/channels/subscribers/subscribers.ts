import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams } from 'angular2/router';

import { Client } from '../../../services/api';
import { Material } from '../../../directives/material';
import { SessionFactory } from '../../../services/session';
import { InfiniteScroll } from '../../../directives/infinite-scroll';
import { UserCard } from '../../../controllers/cards/cards';


@Component({
  selector: 'minds-channel-subscribers',
  viewBindings: [ Client ],
  properties: ['channel']
})
@View({
  templateUrl: 'src/controllers/channels/subscribers/subscribers.html',
  directives: [ CORE_DIRECTIVES, Material, InfiniteScroll, UserCard ]
})

export class ChannelSubscribers {
  session = SessionFactory.build();

  guid : string;
  users : Array<any> = [];

  offset : string = "";
  moreData : boolean = true;
  inProgress : boolean = false;

  constructor(public client: Client){
  }

  set channel(value: any) {
    this.guid = value.guid;
    this.load();
  }

  load(){
    if(this.inProgress)
      return;
    this.inProgress = true;
    this.client.get('api/v1/subscribe/subscribers/' + this.guid, {  offset: this.offset  })
      .then((response : any) => {

        if(!response.users || response.users.length == 0){
          this.moreData = false;
          this.inProgress = false;
          return;
        }

        this.users = this.users.concat(response.users);

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

}
