import {
  Component,
  Injector,
  Input,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { DiscoveryFeedsSettingsComponent } from '../feeds/settings.component';
import { DiscoveryTagSettingsComponent } from '../tags/settings.component';
import { DiscoveryTagsService } from '../tags/tags.service';
import { DiscoveryFeedsService } from '../feeds/feeds.service';
import { DiscoveryTrendsService } from '../trends/trends.service';
import { FeaturesService } from '../../../services/features.service';
import { ContentSettingsComponent } from '../../content-settings/content-settings/content-settings.component';
import { ModalService } from '../../../services/ux/modal.service';
import { ComponentType } from '@angular/cdk/overlay';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-discovery__settingsButton',
  templateUrl: './settings-button.component.html',
})
export class DiscoverySettingsButtonComponent implements OnInit {
  @Input() modalType: 'feed' | 'tags' | 'content-settings';

  contentSettingsFlag: boolean = false;

  constructor(
    private service: DiscoveryTagsService,
    private modalService: ModalService,
    private injector: Injector,
    private featuresService: FeaturesService,
    public session: Session,
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
    let component: ComponentType<
      | DiscoveryFeedsSettingsComponent
      | DiscoveryTagSettingsComponent
      | ContentSettingsComponent
    >;

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

    const modal = this.modalService.present(component, {
      data: {
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
          modal.dismiss();
        },
      },
      injector: this.injector,
    });
  }
}
