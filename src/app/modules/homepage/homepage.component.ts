import { Component, OnDestroy, OnInit } from '@angular/core';
import { Client } from '../../services/api/client';
import { MindsTitle } from '../../services/ux/title';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Session } from '../../services/session';

@Component({
  selector: 'm-homepage',
  templateUrl: 'homepage.component.html',
})
export class HomepageComponent implements OnDestroy {
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
