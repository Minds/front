import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router, Location } from 'angular2/router';

import { Modal } from '../modal';
import { SignupModalService } from './service';
import { FORM_COMPONENTS } from '../../forms/forms';
import { Tutorial } from '../../tutorial/tutorial';
import { SessionFactory } from '../../../services/session';
import { AnalyticsService } from '../../../services/analytics';


@Component({
  selector: 'm-modal-signup',
  inputs: ['open', 'subtitle'],
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal, FORM_COMPONENTS, Tutorial ],
  template: `
    <m-modal [open]="open" (closed)="onClose($event)" *ngIf="!session.isLoggedIn() || display != 'initial'">
      <div class="mdl-card__title" [hidden]="display == 'onboarding'">
        <img src="/assets/logos/small.png" (click)="close()"/>
      </div>

      <!-- Initial Display -->
      <div *ngIf="display == 'initial'">
        <div class="mdl-card__supporting-text">
          {{service.subtitle}}
        </div>
        <div class="mdl-card__supporting-text m-signup-buttons">
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
      <minds-form-onboarding (done)="done('onboarding')" *ngIf="display == 'onboarding'"></minds-form-onboarding>
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

  constructor(private router : Router, private location : Location, private service : SignupModalService){
    this.listen();
    this.service.isOpen.subscribe({next: open => this.open = open });
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
        this.close();
    }

  }

  do(display : string){
    console.log(this.route);
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
      case "onboarding":
        this.display = 'onboarding';
        break;
    }

  }

  done(display : string){
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
        this.display = 'onboarding';
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
    if(this.display == 'login' || this.display == 'register'){
      this.display = 'initial';
      setTimeout(() => { this.service.open(); });
      this.router.navigateByUrl(this.route);
    }
  }

}
