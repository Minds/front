import { Component, OnInit } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../common/services/configs.service';

@Component({
  selector: 'm-onboarding__noticeStep',
  templateUrl: 'notice.component.html',
})
export class NoticeStepComponent implements OnInit {
  user: MindsUser;
  readonly cdnAssetsUrl: string;

  constructor(
    private session: Session,
    private router: Router,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.user = session.getLoggedInUser();
  }

  ngOnInit() {}

  continue() {
    this.router.navigate(['/onboarding', 'hashtags']);
  }

  skip() {
    this.router.navigate(['/newsfeed/global/top']);
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
