import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { LoginReferrerService } from '../../services/login-referrer.service';

@Component({
  selector: 'm-homepage',
  templateUrl: 'homepage.component.html',
})
export class HomepageComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

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
    this.title.setTitle('Minds Social Network', false);

    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
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
