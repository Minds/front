import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Session } from '../../../services/session';
import { MobileService } from '../mobile.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-mobile--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMarketingComponent {
  readonly cdnAssetsUrl: string;
  user;

  releases: any[] = [];
  inProgress: boolean = false;
  error: string;
  latestRelease: any = {
    href: null,
  };

  constructor(
    protected session: Session,
    protected service: MobileService,
    protected cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.load();
  }

  /**
   * Gets releases for view.
   */
  async load() {
    try {
      this.inProgress = true;
      this.detectChanges();

      this.releases = await this.service.getReleases();
      this.latestRelease = this.releases.filter(
        rel => rel.latest && !rel.unstable
      )[0];
    } catch (e) {
      console.error(e);
      this.error = e.message || 'Unknown error';
    }

    this.inProgress = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
