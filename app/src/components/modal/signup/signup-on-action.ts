import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';

import { Modal } from '../modal';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'm-modal-signup-on-action',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Modal ],
  inputs: ['open','action'],
  outputs: ['closed'],
  template: `
    <m-modal [open]="open" (closed)="close($event)" *ngIf="!session.isLoggedIn()">
      <div class="mdl-card__title">
        <img src="/assets/logos/small.png" (click)="close()"/>
      </div>
      <div class="mdl-card__supporting-text">
        You need to have a channel in order to {{action}}
      </div>
      <div class="mdl-card__supporting-text">
        <button class="mdl-button mdl-button--raised mdl-button--colored" [routerLink]="['/Register']">Signup</button>
        <button class="mdl-button mdl-button--raised mdl-button--colored" [routerLink]="['/Login']">Login</button>
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
    </m-modal>
  `
})

export class SignupOnActionModal {

  open : boolean = false;
  action : string = "";
  session = SessionFactory.build();
  closed : EventEmitter<any> = new EventEmitter();

  constructor(){

  }

  close(){
    this.open = false;
    this.closed.next(true);
  }

}
