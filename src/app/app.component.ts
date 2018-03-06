import { Component } from '@angular/core';

import { NotificationService } from './modules/notifications/notification.service';
import { AnalyticsService } from './services/analytics';
import { SocketsService } from './services/sockets';
import { Session } from './services/session';
import { LoginReferrerService } from './services/login-referrer.service';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { ContextService } from './services/context.service';
import { BlockchainService } from './modules/blockchain/blockchain.service';
import { Web3WalletService } from './modules/blockchain/web3-wallet.service';
import { Client } from './services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-app',
  templateUrl: 'app.component.html',
})
export class Minds {
  name: string;
  minds = window.Minds;

  constructor(
    public session: Session,
    public notificationService: NotificationService,
    public scrollToTop: ScrollToTopService,
    public analytics: AnalyticsService,
    public sockets: SocketsService,
    public loginReferrer: LoginReferrerService,
    public context: ContextService,
    public web3Wallet: Web3WalletService,
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

    this.web3Wallet.setUp();
  }

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
  }
}
