import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BTCSettingsComponent } from '../../payments/btc/settings.component';

@Component({
  selector: 'm-wallet--tokens',
  templateUrl: 'tokens.component.html',
})
export class WalletTokensComponent {
  showOnboarding: boolean = false;

  constructor(
    route: ActivatedRoute,
    private overlayModal: OverlayModalService
  ) {
    route.url.subscribe(() => {
      this.showOnboarding =
        route.snapshot.firstChild &&
        route.snapshot.firstChild.routeConfig.path === 'transactions';
    });
  }

  openBtcSettingsModal() {
    this.overlayModal.create(BTCSettingsComponent, {}).present();
  }
}
