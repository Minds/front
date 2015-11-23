import { Component, CORE_DIRECTIVES } from 'angular2/angular2';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { Modal } from '../modal';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'm-modal-signup',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal ],
  template: `
    <m-modal [open]="open" *ng-if="!session.isLoggedIn()">
      <div class="mdl-card__title">
        <img src="/assets/logos/small.png" (click)="close()"/>
        <h4 class="mdl-color-text--grey-600">The Open Source Social Network</h4>
      </div>
      <div class="mdl-card__supporting-text">
      Signup to comment, upload, vote and receive 100 free views on your content.
      </div>
      <div class="mdl-card__supporting-text">
        <button class="mdl-button mdl-button--raised mdl-button--colored" [router-link]="['/Register']">Signup</button>
        <button class="mdl-button mdl-button--raised mdl-button--colored" [router-link]="['/Login']">Login</button>
      </div>

      <div class="mdl-card__supporting-text m-modal-signup-apps">
        <a href="https://geo.itunes.apple.com/us/app/minds-com/id961771928?mt=8&amp;uo=6">
          <img src="https://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.png">
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.minds.mobile" align="center">
          <img alt="Android app on Google Play" src="https://developer.android.com/images/brand/en_app_rgb_wo_45.png">
        </a>
      </div>

      <div class="mdl-card__supporting-text">
        <span class="m-modal-signup-skip" (click)="close()">Maybe later</span>
      </div>
    </div>
  `
})

export class SignupModal {

  open : boolean = false;
  session = SessionFactory.build();

  constructor(public router : Router){
    this.router.subscribe((route) => {
      switch(route){
        case 'register':
        case 'login':
        case 'forgot-password':
          this.open = false;
          break;
        default:
          if(window.localStorage.getItem('hideSignupModal'))
            this.open = false;
          else
            this.open = true;
      }
    });
  }

  close(){
    this.open = false;
  }

}
