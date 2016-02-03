import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { Client } from '../../services/api';


@Component({
  selector: 'm-third-party-networks-facebook',
  outputs: [ 'done' ],
  directives: [ CORE_DIRECTIVES ],
  template: `
    <div class="overview" *ngIf="page && !inProgress">
        <img [src]="'https://graph.facebook.com/' + page.id + '/picture'" /> {{page.name}}

        <a (click)="drop()">Detach page</a>
    </div>

    <div class="setup" *ngIf="!page && !inProgress">
      <svg width="40" height="40" viewBox="-2 -2 32 32" (click)="connect()">
        <path d="M17.9 14h-3v8H12v-8h-2v-2.9h2V8.7C12 6.8 13.1 5 16 5c1.2 0 2 .1 2 .1v3h-1.8c-1 0-1.2.5-1.2 1.3v1.8h3l-.1 2.8z"></path>
      </svg>

      <div class="m-third-party-networks-facebook-pages-list">
        <div *ngFor="#account of accounts" (click)="selectAccount(account)">
          <img [src]="'https://graph.facebook.com/' + account.id + '/picture'" />{{account.name}} / {{account.id}}
        </div>
      </div>
    </div>
  `
})

export class ThirdPartyNetworksFacebook {

  minds = window.Minds;
  done : EventEmitter<any> = new EventEmitter(true);

  page;
  accounts = [];

  inProgress : boolean = false;

  constructor(public client : Client){
    this.getPage();
  }

  getPage(){
    this.inProgress = true;
    this.client.get('api/v1/thirdpartynetworks/facebook/page')
      .then((response : any) => {
        this.inProgress = false;
        if(!response.page){
          this.page = null;
          return true;
        }
        this.page = response.page;
      });
  }

  connect(){
    this.inProgress = true;
    window.onSuccessCallback = () => {
      this.getAccounts();
    }
    window.open(this.minds.site_url + 'api/v1/thirdpartynetworks/facebook/login');
  }

  getAccounts(){
    this.inProgress = true;
    this.client.get('api/v1/thirdpartynetworks/facebook/accounts')
      .then((response : any) => {
        this.inProgress = false;
        this.accounts = response.accounts;
      });
  }

  selectAccount(account){
    this.inProgress = true;
    this.client.post('api/v1/thirdpartynetworks/facebook/select-page', {
        id: account.id,
        name: account.name,
        accessToken: account.access_token
      })
      .then((response : any) => {
        this.inProgress = false;
        this.page = account;
      });
  }

  drop(){
    this.inProgress = true;
    this.client.delete('api/v1/thirdpartynetworks/facebook')
      .then(() => {
        this.inProgress = false;
        this.page = null;
      })
  }

}
