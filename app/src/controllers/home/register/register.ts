import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { SignupModalService } from '../../../modules/modals/signup/service';
import { LoginReferrerService } from '../../../services/login-referrer.service';

@Component({
  moduleId: module.id,
  selector: 'minds-register',
  templateUrl: 'register.html'
})

export class Register {

  minds = window.Minds;
  session = SessionFactory.build();
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
    private loginReferrer: LoginReferrerService
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
    this.modal.setDisplay('onboarding').open();
    this.loginReferrer.navigate({
      defaultUrl: '/' + this.session.getLoggedInUser().username + ';onboarding=1'
    });
  }

}
