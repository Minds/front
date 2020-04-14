import { Component } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../common/services/configs.service';
import { OnboardingV2Service } from '../../service/onboarding.service';

@Component({
  selector: 'm-onboarding__noticeStep',
  templateUrl: 'notice.component.html',
})
export class NoticeStepComponent {
  user: MindsUser;
  readonly cdnAssetsUrl: string;

  constructor(
    private onboardingService: OnboardingV2Service,
    private session: Session,
    private router: Router,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.user = session.getLoggedInUser();

    this.onboardingService.currentSlide = -1;
  }

  continue() {
    this.onboardingService.next();
  }

  skip() {
    this.router.navigate(['/newsfeed/global/top']);
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
