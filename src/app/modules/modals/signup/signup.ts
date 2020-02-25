import {
  Component,
  ChangeDetectorRef,
  NgZone,
  ApplicationRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { SignupModalService } from './service';
import { Session } from '../../../services/session';
import { AnalyticsService } from '../../../services/analytics';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { SiteService } from '../../../common/services/site.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-modal-signup',
  inputs: ['open', 'subtitle', 'display', 'overrideOnboarding'],
  templateUrl: 'signup.html',
})
export class SignupModal {
  @Output('onClose') onClosed: EventEmitter<any> = new EventEmitter<any>();
  open: boolean = false;
  route: string = '';

  subtitle: string =
    'Signup to comment, upload, vote and receive 100 free views on your content.';
  display: string = 'initial';
  overrideOnboarding: boolean = false;

  get logo() {
    return this.site.isProDomain && this.site.pro.logo_image
      ? this.site.pro.logo_image
      : `${this.configs.get('cdn_assets_url')}assets/logos/logo.svg`;
  }

  constructor(
    public session: Session,
    private router: Router,
    private location: Location,
    private service: SignupModalService,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private applicationRef: ApplicationRef,
    private loginReferrer: LoginReferrerService,
    private analyticsService: AnalyticsService,
    private site: SiteService,
    private configs: ConfigsService
  ) {
    this.listen();
    this.service.isOpen.subscribe({
      next: open => {
        this.open = open;
        // hack: nasty ios work around
        this.applicationRef.tick();
        this.listen();
      },
    });
    this.service.display.subscribe({
      next: display => (this.display = display),
    });
  }

  listen() {
    this.route = this.location.path();
  }

  close() {
    switch (this.display) {
      case 'login':
        this.display = 'initial';
        break;
      case 'register':
        this.display = 'initial';
        break;
      default:
        this.service.close();
        this.onClosed.emit();
    }
  }

  do(display: string) {
    let op = this.route.indexOf('?') > -1 ? '&' : '?';
    switch (display) {
      case 'login':
        //hack to provide login page in history
        window.history.pushState(
          null,
          'Login',
          this.route + `${op}modal=login`
        );
        this.analyticsService.send('pageview', {
          url: this.route + `${op}modal=login`,
        });
        this.display = 'login';
        break;
      case 'register':
        window.history.pushState(
          null,
          'Register',
          this.route + `${op}modal=register`
        );
        this.analyticsService.send('pageview', {
          url: this.route + `${op}modal=register`,
        });
        this.display = 'register';
        break;
      case 'fb':
        window.onSuccessCallback = user => {
          this.zone.run(() => {
            this.session.login(user);

            if (user['new']) {
              this.display = 'fb-complete';
            }

            if (!user['new']) {
              this.done('login');
            }
          });
        };
        window.onErrorCallback = reason => {
          if (reason) {
            alert(reason);
          }
        };
        window.open(
          this.site.baseUrl + 'api/v1/thirdpartynetworks/facebook/login',
          'Login with Facebook',
          'toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=600, height=400, top=100, left=100'
        );
        break;
    }
  }

  done(display: string) {
    if (this.overrideOnboarding) {
      this.display = 'initial';
      this.close();
      return;
    }
    switch (display) {
      case 'login':
        this.loginReferrer.navigate({
          extraParams: `ref=signup&ts=${Date.now()}`,
        });
        this.display = 'initial'; //stop listening for modal now.
        this.close();
        break;
      case 'register':
        this.loginReferrer.navigate({
          extraParams: `ref=signup-modal&ts=${Date.now()}`,
        });
        this.display = 'initial';
        this.close();
        break;
      case 'fb':
        this.loginReferrer.navigate({
          extraParams: `ref=signup-modal&ts=${Date.now()}`,
        });
        this.display = 'fb-username';
        break;
      case 'tutorial':
        this.display = 'initial';
        this.close();
        break;
    }
  }

  onClose(e: boolean) {
    this.service.close();
    this.onClosed.emit();
    if (
      this.display === 'login' ||
      this.display === 'register' ||
      this.display === 'fb-complete'
    ) {
      this.display = 'initial';
      setTimeout(() => {
        this.service.open();
      });
      this.router.navigateByUrl(this.route);
    }
  }

  get description() {
    if (!this.site.isProDomain) {
      return '';
    }

    return this.site.pro.one_line_headline || '';
  }
}
