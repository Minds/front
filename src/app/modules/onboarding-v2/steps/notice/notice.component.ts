import { Component, OnInit } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'm-onboarding__noticeStep',
  templateUrl: 'notice.component.html',
})
export class NoticeStepComponent implements OnInit {
  user: MindsUser;
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  constructor(private session: Session, private router: Router) {
    this.user = session.getLoggedInUser();
  }

  ngOnInit() {}

  continue() {
    this.router.navigate(['/onboarding', 'hashtags']);
  }

  skip() {
    this.router.navigate(['/newsfeed']);
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
