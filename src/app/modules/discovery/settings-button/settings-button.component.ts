import { Component, Injector, Input, Optional, SkipSelf } from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { DiscoveryFeedsSettingsComponent } from '../feeds/settings.component';
import { DiscoveryTagSettingsComponent } from '../tags/settings.component';
import { DiscoveryTagsService } from '../tags/tags.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';
import { DiscoveryTrendsService } from '../trends/trends.service';

@Component({
  selector: 'm-discovery__settingsButton',
  templateUrl: './settings-button.component.html',
})
export class DiscoverySettingsButtonComponent {
  @Input() modalType: 'feed' | 'tags';

  constructor(
    private service: DiscoveryTagsService,
    private overlayModal: OverlayModalService,
    private injector: Injector,
    @Optional() @SkipSelf() private feeds: DiscoveryFeedsService,
    @Optional() @SkipSelf() private trends: DiscoveryTrendsService
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

              if (this.feeds !== null) {
                this.feeds.load();
              }
              if (this.trends !== null) {
                this.trends.loadTrends();
              }
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
        // Do nothing.
      })
      .present();
  }
}
