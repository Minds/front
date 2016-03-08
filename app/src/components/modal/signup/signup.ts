import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { Modal } from '../modal';
import { FORM_COMPONENTS } from '../../forms/forms';
import { SessionFactory } from '../../../services/session';
import { ScrollService } from '../../../services/ux/scroll';
import { AnalyticsService } from '../../../services/analytics';


@Component({
  selector: 'm-modal-signup',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal, FORM_COMPONENTS ],
  template: `
    {{open}} {{display}}
    <m-modal [open]="open" (closed)="onClose($event)" *ngIf="!session.isLoggedIn() || display != 'initial'">
      <div class="mdl-card__title">
        <img src="/assets/logos/small.png" (click)="close()"/>
      </div>

      <!-- Initial Display -->
      <div *ngIf="display == 'initial'">
        <div class="mdl-card__supporting-text">
        Signup to comment, upload, vote and receive 100 free views on your content.
        </div>
        <div class="mdl-card__supporting-text">
          <button class="mdl-button mdl-button--raised mdl-button--colored" (click)="do('register')">Signup</button>
          <button class="mdl-button mdl-button--raised mdl-button--colored" (click)="do('login')">Login</button>
        </div>

        <div class="mdl-card__supporting-text m-modal-signup-apps">
          <a href="https://geo.itunes.apple.com/us/app/minds-com/id961771928?mt=8&amp;uo=6">
            <img src="https://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.png">
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.minds.mobile" align="center">
            <img alt="Android app on Google Play" src="{{minds.cdn_url}}assets/ext/playstore.png">
          </a>
        </div>

        <div class="mdl-card__supporting-text">
          <span class="m-modal-signup-skip" (click)="close()">Maybe later</span>
        </div>
      </div>
      <!-- Login Display -->
      <minds-form-login (done)="done('login')" (canceled)="close()" *ngIf="display == 'login'"></minds-form-login>
      <!-- Register Display -->
      <minds-form-register (done)="done('register')" (canceled)="close()" *ngIf="display == 'register'"></minds-form-register>
      <!-- Onboarding Display -->
      <minds-onboarding (done)="done('onboarding')" *ngIf="display == 'onboarding'"></minds-onboarding>
    </m-modal>
  `
})

export class SignupModal {

  open : boolean = false;
  session = SessionFactory.build();
  route : string = "";
  scroll_listener;
  minds = window.Minds;

  display : string = 'initial';

  constructor(public router : Router, public scroll : ScrollService){
    this.listen();
  }

  listen(){
    this.router.subscribe((route) => {
      this.route = route;
      switch(route.split('?')[0]){
        case 'register':
        case 'login':
        case 'forgot-password':
        case '':
          this.open = false;
          break;
        default:
          this.scroll_listener = this.scroll.listen((e) => {
            if(this.scroll.view.scrollTop > 100){
              if(window.localStorage.getItem('hideSignupModal'))
                this.open = false;
              else
                this.open = true;
              this.scroll.unListen(this.scroll_listener);
            }
          }, 100);
      }
    });
  }

  close(){
    switch(this.display){
      case "login":
        this.display = 'initial';
        break;
      case "register":
        this.display = 'initial';
        break;
      default:
        this.open = false;
    }

  }

  do(display : string){
    switch(display){
      case "login":
        //hack to provide login page in history
        window.history.pushState(null, 'Login', '/login');
        AnalyticsService.send('pageview', { 'page' : '/login' });
        this.display = 'login';
        break;
      case "register":
        window.history.pushState(null, 'Register', '/register');
        AnalyticsService.send('pageview', { 'page' : '/register' });
        this.display = 'register';
        break;
    }

  }

  done(display : string){
    switch(display){
      case "login":
        this.router.navigateByUrl(this.route.indexOf('?') > -1 ?
          this.route  + '&referrer=signup-model&ts=' + Date.now() :
          this.route  + '?referrer=signup-model&ts=' + Date.now());
        break;
      case "register":
    }

    this.display = 'initial'; //stop listening for modal now.
    this.open = false;
  }

  onClose(e : boolean){
    if(this.display != 'initial'){
      this.display = 'initial';
      this.open = false; //just to reset change detection
      setTimeout(() => { this.open = true; });
      this.router.navigateByUrl(this.route);
    }
  }

  ngOnDestroy(){
    if(this.scroll_listener)
      this.scroll.unListen(this.scroll_listener);
  }

}
