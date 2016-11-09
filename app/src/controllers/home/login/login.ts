import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { SignupModalService } from '../../../components/modal/signup/service';
import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-login',
  providers: [ MindsTitle ],
  templateUrl: 'login.html'
})

export class Login {

  session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;
  inProgress : boolean = false;
  referrer : string;
  minds = window.Minds;

  flags = {
    canPlayInlineVideos: true
  };

  constructor(public client : Client, public router: Router, public route: ActivatedRoute, public title: MindsTitle, private modal : SignupModalService){
  }

  paramsSubscription: Subscription;
  ngOnInit() {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['/newsfeed']);
    }

    this.title.setTitle("Login");

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

  loggedin(){
    if(this.referrer)
      this.router.navigateByUrl(this.referrer);
    else
      this.router.navigate(['/newsfeed']);
  }

  registered(){
    this.modal.setDisplay('categories').open();
    this.router.navigate(['/newsfeed']);
  }

}
