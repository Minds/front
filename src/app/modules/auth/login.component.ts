import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { SignupModalService } from '../modals/signup/service';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { OnboardingService } from '../onboarding/onboarding.service';

@Component({
  selector: 'm-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent {

  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  referrer: string;
  minds = window.Minds;
  private redirectTo: string;

  flags = {
    canPlayInlineVideos: true
  };

  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private modal: SignupModalService,
    private loginReferrer: LoginReferrerService,
    public session: Session,
    private onboarding: OnboardingService,
  ) { }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.navigate();
    }

    this.title.setTitle('Login');
    this.redirectTo = localStorage.getItem('redirect');

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['referrer']) {
        this.referrer = params['referrer'];
      }
    });

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  loggedin() {
    if (this.referrer)
      this.router.navigateByUrl(this.referrer);
    else if (this.redirectTo)
      this.router.navigate([this.redirectTo]);
    else
      this.loginReferrer.navigate();
  }

  registered() {
    this.onboarding.show();
    if (this.redirectTo)
        this.router.navigate([this.redirectTo]);
    else {
	this.modal.setDisplay('categories').open();
        this.loginReferrer.navigate({
            defaultUrl: '/' + this.session.getLoggedInUser().username + ';onboarding=1'
        });
    }
  }

}
