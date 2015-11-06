import { Inject, Injector, bind } from 'angular2/angular2';
import { Client } from 'src/services/api';
import { SessionFactory } from './session';

export class NotificationService {

  session = SessionFactory.build();

  constructor(@Inject(Client) public client : Client){

  }

  /**
   * Increment the notifications. For boost
   */
  increment(notifications : number = 1){
    window.Minds.notifications = window.Minds.notifications + notifications;
    this.sync();
  }

  /**
   * Clear the notifications. For notification controller
   */
  clear(){
    window.Minds.notifications = 0;
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

      if(!window.Minds.notifications)
         window.Minds.notifications = 0;

      self.client.get('api/v1/notification/count', {})
       .then((response : any) => {
         window.Minds.notifications = response.count;
         self.sync();
       })
       .catch((exception : any) =>
        {});
    },30000);
   }

  /**
   * Sync Notifications to the topbar Counter
   */
  sync(){
    for(var i in window.Minds.navigation.topbar){
      if(window.Minds.navigation.topbar[i].name == 'Notifications'){
        window.Minds.navigation.topbar[i].extras.counter = window.Minds.notifications;
      }
    }
  }

}
