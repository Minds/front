import { Component } from '@angular/core';

import { NotificationService } from './src/services/notification';
import { AnalyticsService} from './src/services/analytics'
import { SocketsService } from './src/services/sockets';
import { Session, SessionFactory } from './src/services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-app',
  templateUrl: 'src/controllers/index.html'
})
export class Minds {
  name: string;
  minds = window.Minds;
  session: Session = SessionFactory.build();

  constructor(public notificationService : NotificationService, public analytics : AnalyticsService, public sockets: SocketsService) {
    this.name = 'Minds';
  }

  ngOnInit() {
    this.notificationService.getNotifications();

    this.session.isLoggedIn((is) => {
      if (is) {
        if (this.minds.user.language != this.minds.language) {
          console.log('[app]:: language change', this.minds.user.language, this.minds.language)
          window.location.reload(true);
        }
      }
    });
  }
}
