import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Session } from '../../../services/session';
import { MobileService } from '../mobile.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { FormToastService } from '../../../common/services/form-toast.service';

@Component({
  selector: 'm-mobile__marketing',
  templateUrl: 'marketing.component.html',
  styleUrls: [
    '../../aux-pages/aux-pages.component.ng.scss',
    './marketing.component.ng.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMarketingComponent {
  readonly cdnAssetsUrl: string;
  user;

  releases: any[] = [];
  inProgress: boolean = false;
  showReleases: boolean = false;
  error: string;
  latestRelease: any = {
    href: null,
  };

  constructor(
    protected session: Session,
    protected service: MobileService,
    protected cd: ChangeDetectorRef,
    configs: ConfigsService,
    protected toasterService: FormToastService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.load();
  }

  toggleReleases() {
    this.showReleases = !this.showReleases;
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
      this.toasterService.error(
        'Oops! There was an issue retrieving mobile releases: ' + this.error
      );
    }

    this.inProgress = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
