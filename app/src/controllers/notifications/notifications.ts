import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouterLink } from 'angular2/router';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';
import { Material } from '../../directives/material';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { NotificationService } from '../../services/notification';


@Component({
  selector: 'minds-notifications',
  viewBindings: [ Client, NotificationService],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/notifications/list.html',
  directives: [ CORE_DIRECTIVES, RouterLink, Material, InfiniteScroll ]
})

export class Notifications {

  notifications : Array<Object> = [];
  moreData : boolean = true;
  offset: string = "";
  inProgress : boolean = false;
  session = SessionFactory.build();

  constructor(public client: Client, public router: Router, public title : MindsTitle, public notificationService : NotificationService ){
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

    this.client.get('api/v1/notifications', {limit:12, offset:this.offset})
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

}
