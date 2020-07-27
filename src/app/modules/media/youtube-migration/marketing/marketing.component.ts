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
import { LoginReferrerService } from '../../../../services/login-referrer.service';

@Component({
  selector: 'm-youtubeMigration__marketing',
  templateUrl: './marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeMigrationMarketingComponent {
  readonly cdnAssetsUrl: string;
  readonly youtubeSettingsUrl: '/settings/other/youtube-migration';

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected loginReferrer: LoginReferrerService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  action() {
    if (this.session.isLoggedIn()) {
      this.router.navigate([this.youtubeSettingsUrl]);
    } else {
      this.loginReferrer.register(this.youtubeSettingsUrl);
      this.router.navigate(['/login']);
      return;
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
