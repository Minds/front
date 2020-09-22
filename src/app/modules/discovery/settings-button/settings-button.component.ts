import { Component, Injector, SkipSelf, Input, Output } from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { DiscoveryFeedsSettingsComponent } from '../feeds/settings.component';
import { DiscoveryTagSettingsComponent } from '../tags/settings.component';
import { DiscoveryTagsService } from '../tags/tags.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';

@Component({
  selector: 'm-discovery__settingsButton',
  templateUrl: './settings-button.component.html',
})
export class DiscoverySettingsButtonComponent {
  @Input() modalType: 'feed' | 'tags';

  constructor(
    private service: DiscoveryTagsService,
    private overlayModal: OverlayModalService,
    private feeds: DiscoveryFeedsService,
    private injector: Injector
  ) {}

  openSettingsModal(e: MouseEvent): void {
    let component: Object;

    switch (this.modalType) {
      case 'feed':
        component = DiscoveryFeedsSettingsComponent;
        break;
      case 'tags':
        component = DiscoveryTagSettingsComponent;
        break;
      default:
        return;
    }

    this.overlayModal
      .create(
        component,
        null,
        {
          wrapperClass: 'm-modalV2__wrapper',
          onSave: payload => {
            if (this.modalType === 'tags') {
              const tags = payload;
              this.service.tags$.next(tags);
              this.feeds.load();
            }
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
