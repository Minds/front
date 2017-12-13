import { Component } from '@angular/core';

import { NotificationService } from './src/modules/notifications/notification.service';
import { AnalyticsService } from './src/services/analytics';
import { SocketsService } from './src/services/sockets';
import { Session, SessionFactory } from './src/services/session';
import { LoginReferrerService } from './src/services/login-referrer.service';
import { ScrollToTopService } from './src/services/scroll-to-top.service';
import { ContextService } from './src/services/context.service';
import { BlockchainService } from './src/modules/blockchain/blockchain.service';
import { Web3WalletService } from './src/modules/blockchain/web3-wallet.service';

@Component({
  moduleId: module.id,
  selector: 'm-app',
  templateUrl: 'app.component.html'
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
    public web3Wallet: Web3WalletService
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

    this.web3Wallet.setUp();
  }

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
  }
}
