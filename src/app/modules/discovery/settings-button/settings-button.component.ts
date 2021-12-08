import {
  Component,
  Injector,
  Input,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { DiscoveryFeedsSettingsComponent } from '../feeds/settings.component';
import { DiscoveryTagSettingsComponent } from '../tags/settings.component';
import { DiscoveryTagsService } from '../tags/tags.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';
import { DiscoveryTrendsService } from '../trends/trends.service';
import { FeaturesService } from '../../../services/features.service';
import { ContentSettingsComponent } from '../../content-settings/content-settings/content-settings.component';

@Component({
  selector: 'm-discovery__settingsButton',
  templateUrl: './settings-button.component.html',
})
export class DiscoverySettingsButtonComponent implements OnInit {
  @Input() modalType: 'feed' | 'tags' | 'content-settings';

  contentSettingsFlag: boolean = false;

  constructor(
    private service: DiscoveryTagsService,
    private overlayModal: OverlayModalService,
    private injector: Injector,
    private featuresService: FeaturesService,
    @Optional() @SkipSelf() private feeds: DiscoveryFeedsService,
    @Optional() @SkipSelf() private trends: DiscoveryTrendsService
  ) {}

  ngOnInit(): void {
    this.contentSettingsFlag =
      this.featuresService.has('content-settings-modal') || false;

    if (this.contentSettingsFlag) {
      this.modalType = 'content-settings';
    }
  }

  openSettingsModal(e: MouseEvent): void {
    let component: ComponentType<any>;

    switch (this.modalType) {
      case 'feed':
        component = DiscoveryFeedsSettingsComponent;
        break;
      case 'tags':
        component = DiscoveryTagSettingsComponent;
        break;
      case 'content-settings':
        component = ContentSettingsComponent;
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
