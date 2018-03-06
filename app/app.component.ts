import { Component } from '@angular/core';

import { NotificationService } from './src/modules/notifications/notification.service';
import { AnalyticsService } from './src/services/analytics';
import { SocketsService } from './src/services/sockets';
import { Session, SessionFactory } from './src/services/session';
import { LoginReferrerService } from './src/services/login-referrer.service';
import { ScrollToTopService } from './src/services/scroll-to-top.service';
import { ContextService } from './src/services/context.service';
import { Client } from './src/services/api/client';

@Component({
  moduleId: module.id,
  selector: 'minds-app',
  templateUrl: 'src/controllers/index.html'
})
export class Minds {
  name: string;
  minds = window.Minds;
  session: Session = SessionFactory.build();

  constructor(
    public notificationService: NotificationService,
    public scrollToTop: ScrollToTopService,
    public analytics: AnalyticsService,
    public sockets: SocketsService,
    public loginReferrer: LoginReferrerService,
    public context: ContextService,
    public client: Client,
  ) {
    this.name = 'Minds';
  }

  ngOnInit() {
    this.notificationService.getNotifications();

    this.session.isLoggedIn((is) => {
      if (is) {
        if (this.minds.user.language !== this.minds.language) {
          console.log('[app]:: language change', this.minds.user.language, this.minds.language);
          window.location.reload(true);
        }
      }
    });

    this.loginReferrer
      .avoid([
        '/login',
        '/logout',
        '/register',
        '/forgot-password',
      ])
      .listen();

    this.scrollToTop.listen();

    this.context.listen();
  }

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
  }
}
