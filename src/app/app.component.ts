import { ChangeDetectorRef, Component, NgZone } from '@angular/core';

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
import { WebtorrentService } from './modules/webtorrent/webtorrent.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ChannelOnboardingService } from "./modules/onboarding/channel/onboarding.service";
import { BlockListService } from "./common/services/block-list.service";
import { FeaturesService } from "./services/features.service";
import { ThemeService } from "./common/services/theme.service";
import { BannedService } from './modules/report/banned/banned.service';

@Component({
  moduleId: module.id,
  selector: 'm-app',
  templateUrl: 'app.component.html',
})
export class Minds {
  name: string;
  minds = window.Minds;

  showOnboarding: boolean = false;

  showTOSModal: boolean = false;

  paramsSubscription;

  constructor(
    public session: Session,
    public route: ActivatedRoute,
    public notificationService: NotificationService,
    public scrollToTop: ScrollToTopService,
    public analytics: AnalyticsService,
    public sockets: SocketsService,
    public loginReferrer: LoginReferrerService,
    public context: ContextService,
    public web3Wallet: Web3WalletService,
    public client: Client,
    public webtorrent: WebtorrentService,
    public onboardingService: ChannelOnboardingService,
    public router: Router,
    public blockListService: BlockListService,
    public featuresService: FeaturesService,
    public themeService: ThemeService,
    private bannedService: BannedService,
  ) {
    this.name = 'Minds';
  }

  async ngOnInit() {
    this.notificationService.getNotifications();

    this.session.isLoggedIn(async (is) => {
      if (is) {
        this.showOnboarding = await this.onboardingService.showModal();
        if (this.minds.user.language !== this.minds.language) {
          console.log('[app]:: language change', this.minds.user.language, this.minds.language);
          window.location.reload(true);
        }
      }
    });

    this.onboardingService.onClose.subscribe(() => {
      this.showOnboarding = false;
      this.router.navigate(['/newsfeed']);
    });

    this.onboardingService.onOpen.subscribe(async () => {
      this.showOnboarding = await this.onboardingService.showModal(true);
    });

    this.loginReferrer
      .avoid([
        '/login',
        '/logout',
        '/logout/all',
        '/register',
        '/forgot-password',
      ])
      .listen();

    this.scrollToTop.listen();

    this.context.listen();

    this.web3Wallet.setUp();

    this.webtorrent.setUp();
    
    this.themeService.setUp();

    if (this.session.isLoggedIn()) {
      this.blockListService.sync();
    }
  }

  ngOnDestroy() {
    this.loginReferrer.unlisten();
    this.scrollToTop.unlisten();
    this.paramsSubscription.unsubscribe();
  }
}
