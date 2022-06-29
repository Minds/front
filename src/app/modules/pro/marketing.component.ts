import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';
import { Session } from '../../services/session';

/**
 * Marketing page that describes the benefits of upgrading to Pro
 */
@Component({
  selector: 'm-pro__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['marketing.component.ng.scss'],
})
export class ProMarketingComponent {
  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected session: Session,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  goToSettings() {
    const username = this.session.getLoggedInUser().username;
    this.router.navigate([`/settings/pro_canary/${username}`]);
  }

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
