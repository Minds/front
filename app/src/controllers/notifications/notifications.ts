import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouterLink, RouteParams } from 'angular2/router';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';
import { Material } from '../../directives/material';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { NotificationService } from '../../services/notification';
import { CARDS } from '../cards/cards';


@Component({
  selector: 'minds-notifications',
  bindings: [ MindsTitle, NotificationService ],
  templateUrl: 'src/controllers/notifications/list.html',
  directives: [ CORE_DIRECTIVES, RouterLink, Material, CARDS, InfiniteScroll ]
})

export class Notifications {

  notifications : Array<Object> = [];
  entity;
  moreData : boolean = true;
  offset: string = "";
  inProgress : boolean = false;
  session = SessionFactory.build();
  _filter: string = 'all';

  constructor(public client: Client, public router: Router, public title : MindsTitle, public notificationService : NotificationService, public params: RouteParams){
    if(params.params['filter']) {
      this._filter = params.params['filter'];
    }

    if(!this.session.isLoggedIn()){
      router.navigate(['/Login']);
    } else {
      this.load(true);
    }
    this.notificationService.clear();
    this.title.setTitle("Notifications");
  }

  load(refresh : boolean = false){
    var self = this;

    if(this.inProgress) return false;

    if(refresh)
      this.offset = "";

    this.inProgress = true;

    this.client.get(`api/v1/notifications/${this._filter}`, {limit:12, offset:this.offset})
      .then((data : any) => {

        if(!data.notifications){
          self.moreData = false;
          self.inProgress = false;
          return false;
        }

        if(refresh){
          self.notifications = data.notifications;
        }else{
          if(self.offset)
            data.notifications.shift();
          for(let entity of data.notifications)
            self.notifications.push(entity);
        }

        self.offset = data['load-next'];
        self.inProgress = false;

      });
  }

  loadEntity(entity){
    if(entity.type == 'comment'){
      this.client.get('api/v1/entities/entity/' + entity.parent_guid)
        .then((response : any) => {
          this.entity = response.entity;
        });
    } else {
      this.entity = entity;
    }
  }

}
