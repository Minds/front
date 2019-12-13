import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Client } from '../../services/api/client';
import { MindsTitle } from '../../services/ux/title';
import { Router } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { Session } from '../../services/session';
import { V2TopbarService } from '../../common/layout/v2-topbar/v2-topbar.service';
import { RegisterForm } from '../forms/register/register';

@Component({
  selector: 'm-homepage',
  templateUrl: 'homepage.component.html',
})
export class HomepageComponent implements OnInit, OnDestroy {
  @ViewChild('registerForm', { static: false }) registerForm: RegisterForm;

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
    public session: Session,
    private loginReferrer: LoginReferrerService,
    private topbarService: V2TopbarService
  ) {
    this.title.setTitle('Minds Social Network', false);

    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }

    this.topbarService.toggleMarketingPages(true);
  }

  ngOnInit() {
    this.onResize();
  }

  ngOnDestroy() {
    this.topbarService.toggleMarketingPages(false);
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

  @HostListener('window:resize')
  onResize() {
    const tick: HTMLSpanElement = document.querySelector(
      '.m-marketing__imageUX > .m-marketing__imageTick'
    );
    if (window.innerWidth > 480 && window.innerWidth < 1168) {
      tick.classList.remove('m-marketing__imageTick--left');
      tick.classList.add('m-marketing__imageTick--right');
    } else {
      tick.classList.add('m-marketing__imageTick--left');
      tick.classList.remove('m-marketing__imageTick--right');
    }
  }

  isMobile() {
    return window.innerWidth <= 540;
  }
}
