import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { PagesService } from '../../common/services/pages.service';
import { MetaService } from '../../common/services/meta.service';
import { iOSVersion } from '../../helpers/is-safari';
import { TopbarService } from '../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { RedirectHandlerService } from './param-handlers/redirect-handler.service';
import { ReferrerHandlerService } from './param-handlers/referrer-handler.service';

@Component({
  selector: 'm-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.ng.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  videoError: boolean = false;

  @HostBinding('class.m-register--newDesign')
  newDesign: boolean = true;

  @HostBinding('class.m-register--newNavigation')
  newNavigation: boolean = true;

  @HostBinding('class.m-register__iosFallback')
  iosFallback: boolean = false;

  flags = {
    canPlayInlineVideos: true,
  };

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public pagesService: PagesService,
    private loginReferrer: LoginReferrerService,
    public session: Session,
    public navigation: NavigationService,
    private navigationService: SidebarNavigationService,
    private topbarService: TopbarService,
    private metaService: MetaService,
    private pageLayoutService: PageLayoutService,
    private redirect: RedirectHandlerService,
    private referrer: ReferrerHandlerService
  ) {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
      return;
    }
  }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.register('/newsfeed');
      this.loginReferrer.navigate();
    }

    this.topbarService.toggleVisibility(false);
    this.iosFallback = iOSVersion() !== null;

    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();

    this.metaService.setTitle('Register');

    this.referrer.subscribe();

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  /**
   * Called on register.
   * @returns { void }
   */
  registered(): void {
    this.redirect.handle('register');
  }

  onSourceError() {
    this.videoError = true;
  }

  ngOnDestroy() {
    this.topbarService.toggleVisibility(true);
    this.navigationService.setVisible(true);
  }
}
