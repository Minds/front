import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FeaturesService } from '../../services/features.service';
import { Router } from '@angular/router';
import { WALLET_V2_ROUTES } from '../wallet/v2/wallet-v2.module';
import { WALLET_ROUTES } from '../wallet/wallet.module';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-walletContainer',
  templateUrl: 'wallet-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WalletContainerComponent implements OnInit {
  v2Enabled: boolean = false;
  init: boolean = false;

  constructor(
    protected features: FeaturesService,
    protected router: Router,
    configs: ConfigsService
  ) {
    this.v2Enabled = configs.get('features')['wallet-upgrade'];
    if (this.v2Enabled) {
      console.log('*** setting up wallet v2 routes');
      this.router.resetConfig(WALLET_V2_ROUTES);
    } else {
      console.log('*** setting up old wallet routes');
      this.router.resetConfig(WALLET_ROUTES);
    }
  }

  ngOnInit(): void {
    console.log('router url BORK***: ', this.router.url);
    console.log('*** v2enabled?', this.v2Enabled);

    this.router.navigate([this.router.url]);
    this.init = true;
  }

  // listen() {
  //   this.routerSubscription = this.router.events.subscribe(
  //     (navigationEvent: NavigationEnd) => {
  //       try {
  //         if (navigationEvent instanceof NavigationEnd) {
  //           if (!navigationEvent.urlAfterRedirects) {
  //             return;
  //           }

  //           this.handleUrl(navigationEvent.urlAfterRedirects);
  //         }
  //       } catch (e) {
  //         console.error('Minds: router hook(SearchBar)', e);
  //       }
  //     }
  //   );
  // }

  // unListen() {
  //   this.routerSubscription.unsubscribe();
  // }
}
