import { Inject, Injector, bind } from 'angular2/core';
import { Client } from './api';
import { SessionFactory } from './session';

export class NotificationService {

  session = SessionFactory.build();

  constructor(@Inject(Client) public client : Client){
    if(!window.Minds.notifications_count)
      window.Minds.notifications_count = 0;
  }

  /**
   * Increment the notifications. For boost
   */
  increment(notifications : number = 1){
    window.Minds.notifications_count = window.Minds.notifications_count + notifications;
    this.sync();
  }

  /**
   * Clear the notifications. For notification controller
   */
  clear(){
    window.Minds.notifications_count = 0;
    this.sync();
  }

  /**
   * Return the notifications
   */
   getNotifications(){
    var self = this;
    setInterval(function(){
      console.log("getting notifications");

      if (!self.session.isLoggedIn())
        return;

      if(!window.Minds.notifications_count)
         window.Minds.notifications_count = 0;

      self.client.get('api/v1/notifications/count', {})
       .then((response : any) => {
         window.Minds.notifications_count = response.count;
         self.sync();
       })
       .catch((exception : any) =>
        {});
    },60000);
   }

  /**
   * Sync Notifications to the topbar Counter
   */
  sync(){
    for(var i in window.Minds.navigation.topbar){
      if(window.Minds.navigation.topbar[i].name == 'Notifications'){
        window.Minds.navigation.topbar[i].extras.counter = window.Minds.notifications_count;
      }
    }
  }

}
