import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-youtubeMigration__marketing',
  templateUrl: './marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationMarketingComponent {
  readonly cdnAssetsUrl: string;
  readonly youtubeSettingsUrl: '/settings/canary/other/youtube-migration';

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  action() {
    if (this.session.isLoggedIn()) {
      this.router.navigate([this.youtubeSettingsUrl]);
    } else {
      // TODOOJM look up login referrer and redirect back to this.youtubeSettingsUrl
      this.router.navigate(['/login']);
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
