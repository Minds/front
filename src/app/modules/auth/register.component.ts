import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { SignupModalService } from '../modals/signup/service';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { OnboardingService } from '../onboarding/onboarding.service';

@Component({
  selector: 'm-register',
  templateUrl: 'register.component.html'
})

export class RegisterComponent {

  minds = window.Minds;
  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  referrer: string;

  flags = {
    canPlayInlineVideos: true
  };

  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    private modal: SignupModalService,
    private loginReferrer: LoginReferrerService,
    public session: Session,
    private onboarding: OnboardingService,
  ) { }

  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.loginReferrer.navigate();
    }
    
    this.paramsSubscription = this.route.params.subscribe(params => {
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

  registered() {
    this.onboarding.show();
    this.modal.setDisplay('onboarding').open();
    this.loginReferrer.navigate({
      defaultUrl: '/' + this.session.getLoggedInUser().username + ';onboarding=1'
    });
  }

}
