import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MindsTitle} from '../../../services/ux/title';
import {Session} from '../../../services/session';
import {MobileService} from "../mobile.service";

@Component({
  selector: 'm-mobile--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMarketingComponent {
  minds = window.Minds;
  user;

  releases: any[] = [];
  inProgress: boolean = false;
  error: string;
  latestUrl: string;
  
  constructor(
    protected title: MindsTitle,
    protected session: Session,
    protected service: MobileService,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.title.setTitle('Mobile');

    this.user = this.session.getLoggedInUser();

    this.load();
  }

  async load() {
    try {
      this.inProgress = true;
      this.detectChanges();

      this.releases = await this.service.getReleases();
      this.latestUrl = this.releases[0].href;
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
