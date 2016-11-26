import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';
import { NotificationService } from '../../services/notification';

// Configure the module
@Component({
  moduleId: module.id,
  selector: 'minds-notifications',
  templateUrl: 'list.html'
})

// Notifications page class
export class Notifications {

  notifications : Array<Object> = [];
  entity;
  moreData : boolean = true;
  offset: string = "";
  inProgress : boolean = false;
  session = SessionFactory.build();
  _filter: string = 'all';

  constructor(public client: Client, public router: Router, public title : MindsTitle, public notificationService : NotificationService, public route: ActivatedRoute){
  }

  paramsSubscription: Subscription;
  ngOnInit() {
    // If the user is not logged in, then redirect the user to the login page
    if(!this.session.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this._filter = params['filter'];
        this.notifications = [];
        this.load(true);
      }
      if(params['ts']){
        this.notifications = [];
        this.load(true);
        this.notificationService.clear();
      }
    });

    this.load(true);

    this.notificationService.clear();
    this.title.setTitle("Notifications");
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh : boolean = false) {
    var self = this;

    // If in progress, then stop this function
    if(this.inProgress) {
      return false;
    }

    // Clear offset when the refresh argument is true
    if(refresh) {
      this.offset = "";
    }

    // Make sure that there is only one instance of this function
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
