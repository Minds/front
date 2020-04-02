import { Component, Injector, SkipSelf } from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { DiscoveryFeedsSettingsComponent } from './settings.component';

@Component({
  selector: 'm-discoveryFeeds__settingsButton',
  templateUrl: './settings-button.component.html',
})
export class DiscoveryFeedsSettingsButtonComponent {
  constructor(
    private overlayModal: OverlayModalService,
    @SkipSelf() private injector: Injector
  ) {}

  openSettingsModal(): void {
    this.overlayModal
      .create(
        DiscoveryFeedsSettingsComponent,
        null,
        {
          wrapperClass: 'm-modalV2__wrapper',
          onSave: () => {
            this.overlayModal.dismiss();
          },
          onDismissIntent: () => {
            this.overlayModal.dismiss();
          },
        },
        this.injector
      )
      .onDidDismiss(() => {
        console.log('closed tag settings');
      })
      .present();
  }
}
