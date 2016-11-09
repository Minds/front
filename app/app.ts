import { Component } from '@angular/core';

import { NotificationService } from './src/services/notification';
import { AnalyticsService} from './src/services/analytics'
import { SocketsService } from './src/services/sockets';

@Component({
  moduleId: module.id,
  selector: 'minds-app',
  providers: [ AnalyticsService ],
  templateUrl: 'src/controllers/index.html'
})
export class Minds {
  name: string;
  minds = window.Minds;

  constructor(public notificationService : NotificationService, public analytics : AnalyticsService, public sockets: SocketsService) {
    this.name = 'Minds';

    this.notificationService.getNotifications();
  }
}
