import { EventEmitter } from 'angular2/core';
import { Client } from './api';
import { SocketsService } from './sockets';
import { SessionFactory } from './session';

export class NotificationService {

  session = SessionFactory.build();
  socketSubscriptions: any = {
    notification: null
  };
  onReceive: EventEmitter<any> = new EventEmitter();

  constructor(public client: Client, public sockets: SocketsService){
    if(!window.Minds.notifications_count)
      window.Minds.notifications_count = 0;

    this.listen();
  }

  /**
   * Listen to socket events
   */
  listen() {
    this.socketSubscriptions.notification = this.sockets.subscribe('notification', (guid) => {
      this.increment();

      this.client.get(`api/v1/notifications/single/${guid}`)
        .then((response: any) => {
          if (response.notification) {
            this.onReceive.next(response.notification);
          }
        })
        .catch(e => {});
    });
  }

  /**
   * Increment the notifications counter
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
