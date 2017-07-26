import { Component, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { SignupModalService } from './service';
import { SessionFactory } from '../../../services/session';
import { AnalyticsService } from '../../../services/analytics';


@Component({
  selector: 'm-modal-signup',
  inputs: ['open', 'subtitle'],
  template: `
    <m-modal [open]="open" (closed)="onClose($event)" *ngIf="!session.isLoggedIn() || display != 'initial'">
      <div class="mdl-card__title" [hidden]="display == 'onboarding' || display == 'categories'">
        <img src="/assets/logos/small.png" (click)="close()"/>
        <h4 class="mdl-color-text--grey-600" i18n>Your Social Network</h4>
      </div>

      <!-- Initial Display -->
      <div *ngIf="display == 'initial'">
        <div class="mdl-card__supporting-text">
          {{service.subtitle}}
        </div>

        <div class="m-signup-modal-feature-text mdl-card__supporting-text">
          <!-- i18n -->Encrypted messenger. Wallet. Boost. Newsfeed. Blog. Groups. Find people in your city.<!-- /i18n -->
        </div>

        <div class="mdl-card__supporting-text m-signup-buttons">
          <button class="m-fb-login-button" (click)="do('fb')">
            <span class="m-social-icons-icon-inline">
              <svg width="40" height="40" viewBox="-2 -2 32 32">
                <path d="M17.9 14h-3v8H12v-8h-2v-2.9h2V8.7C12 6.8 13.1 5 16 5c1.2 0 2 .1 2 .1v3h-1.8c-1 0-1.2.5-1.2 1.3v1.8h3l-.1 2.8z"></path>
              </svg>
            </span>
            <span class="m-signup-button-text">
              <!-- i18n -->Signin with Facebook<!-- /i18n -->
            </span>
          </button>
          <button class="mdl-color--amber" (click)="do('register')">
            <span class="m-signup-bulb-icon m-wiggle-animation"><img src="/assets/icon.png"></span>
            <span class="m-signup-button-text">
              <!-- i18n -->Signin with Minds<!-- /i18n -->
            </span>
          </button>
        </div>

        <div class="mdl-card__supporting-text m-modal-signup-apps">
          <a href="https://geo.itunes.apple.com/us/app/minds-com/id961771928?mt=8&amp;uo=6">
            <img src="https://devimages.apple.com.edgekey.net/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg">
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.minds.mobile" align="center">
            <img alt="Android app on Google Play" src="{{minds.cdn_url}}assets/ext/playstore.png">
          </a>
        </div>

        <div class="mdl-card__supporting-text">
          <span class="m-modal-signup-skip" (click)="close()" i18n>Maybe later</span>
        </div>
      </div>
      <!-- Login Display -->
      <minds-form-login (done)="done('login')" (doneRegistered)="display = 'fb-complete'" (canceled)="close()" *ngIf="display == 'login'"></minds-form-login>
      <!-- Register Display -->
      <span style="font-weight: bold;text-align:center;font-size: 13px;margin-bottom: -14px;cursor: pointer;" class="mdl-color-text--blue-grey" *ngIf="display == 'register'" (click)="do('login')" i18n>Already have a channel? Click here.</span>
      <minds-form-register (done)="done('register')" (canceled)="close()" *ngIf="display == 'register'"></minds-form-register>
      <!-- FB Signin final phase -->
      <minds-form-fb-register (done)="done('register')" (canceled)="close()" *ngIf="display == 'fb-complete'"></minds-form-fb-register>
      <!-- Categories selector -->
      <minds-onboarding-categories-selector (done)="done('categories')" *ngIf="display == 'categories'"></minds-onboarding-categories-selector>
      <!-- Tutorial Display -->
      <minds-tutorial *ngIf="display == 'tutorial'"></minds-tutorial>
    </m-modal>
  `
})

export class SignupModal {

  open : boolean = false;
  session = SessionFactory.build();
  route : string = "";
  minds = window.Minds;

  subtitle : string = "Signup to comment, upload, vote and receive 100 free views on your content.";
  display : string = 'initial';

  constructor(private router : Router, private location : Location, private service : SignupModalService,
    private cd : ChangeDetectorRef, private zone : NgZone, private applicationRef : ApplicationRef){
    this.listen();
    this.service.isOpen.subscribe({next: open => {
      this.open = open;
      //hack: nasty ios work around
      this.applicationRef.tick();
      this.listen();
    }});
    this.service.display.subscribe({next: display => this.display = display});
  }

  listen(){
    this.route = this.location.path();
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
        this.service.close();
    }

  }

  do(display : string){

    let op = this.route.indexOf('?') > -1 ? '&' : '?';
    switch(display){
      case "login":
        //hack to provide login page in history
        window.history.pushState(null, 'Login', this.route + `${op}modal=login` );
        AnalyticsService.send('pageview', { 'page' : this.route + `${op}modal=login` });
        this.display = 'login';
        break;
      case "register":
        window.history.pushState(null, 'Register', this.route + `${op}modal=register`);
        AnalyticsService.send('pageview', { 'page' : this.route + `${op}modal=register` });
        this.display = 'register';
        break;
      case "fb":

        window.onSuccessCallback = (user) => {
          this.zone.run(() => {
            this.session.login(user);

            if(user['new']){
              this.display = 'fb-complete';
            }

            if(!user['new']){
              this.done('login');
            }

          });
        };
        window.onErrorCallback = (reason) => {
          if(reason){
            alert(reason);
          }
        };
        window.open(this.minds.site_url + 'api/v1/thirdpartynetworks/facebook/login', "Login with Facebook",
          'toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=600, height=400, top=100, left=100');
        break;
      case "categories":
        this.display = 'tutorial';
        break;
    }

  }

  done(display: string) {
    // @todo: emi - check if this is working
    switch(display){
      case "login":
        if(this.router){
          this.router.navigateByUrl(this.route.indexOf('?') > -1 ?
            this.route  + '&referrer=signup-model&ts=' + Date.now() :
            this.route  + '?referrer=signup-model&ts=' + Date.now());
        }
        this.display = 'initial'; //stop listening for modal now.
        this.close();
        break;
      case "register":
        if(this.router){
          this.router.navigateByUrl(this.route.indexOf('?') > -1 ?
            this.route  + '&referrer=signup-model&ts=' + Date.now() :
            this.route  + '?referrer=signup-model&ts=' + Date.now());
        }
        this.display = 'categories';
        break;
      case "fb":
        if(this.router){
          this.router.navigateByUrl(this.route.indexOf('?') > -1 ?
            this.route  + '&referrer=signup-model&ts=' + Date.now() :
            this.route  + '?referrer=signup-model&ts=' + Date.now());
        }
        this.display = 'fb-username';
        break;
      case "categories":
        this.display = 'onboarding'
        break;
      case "onboarding":
        this.display = 'tutorial'
        break;
      case "tutorial":
        this.display = 'initial';
        this.close();
        break;
    }
  }

  onClose(e : boolean){
    this.service.close();
    if(this.display == 'login' || this.display == 'register' || this.display == 'fb-complete'){
      this.display = 'initial';
      setTimeout(() => { this.service.open(); });
      this.router.navigateByUrl(this.route);
    }
  }

}
