import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { LoginReferrerService } from '../../../services/login-referrer.service';

@Component({
  selector: 'm-homepage__v1',
  templateUrl: 'homepage-v1.component.html',
})
export class HomepageV1Component implements OnDestroy {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  topbar: HTMLElement;

  minds = window.Minds;

  flags = {
    canPlayInlineVideos: true,
  };

  constructor(
    public client: Client,
    public title: MindsTitle,
    public router: Router,
    public navigation: NavigationService,
    private loginReferrer: LoginReferrerService,
    public session: Session
  ) {
    this.topbar = document.querySelector('.m-v2-topbar__Top');

    this.title.setTitle('Minds Social Network', false);

    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }

    this.topbar.classList.add('m-v2-topbar__noBackground');
  }

  ngOnDestroy() {
    this.topbar.classList.remove('m-v2-topbar__noBackground');
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

  registered() {
    this.loginReferrer.navigate({
      defaultUrl:
        '/' + this.session.getLoggedInUser().username + ';onboarding=1',
    });
  }
}
