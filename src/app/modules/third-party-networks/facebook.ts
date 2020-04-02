import { Component, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../services/api';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-third-party-networks-facebook',
  outputs: ['done'],
  template: `
    <div
      class="mdl-spinner mdl-js-spinner is-active"
      [mdl]
      [hidden]="!inProgress"
    ></div>

    <div
      class="m-third-party-networks-facebook-card mdl-card mdl-shadow--2dp"
      *ngIf="page && !inProgress"
    >
      <div class="mdl-card__supporting-text m-block">
        <div class="m-avatar">
          <a [href]="page.link">
            <img [src]="'https://graph.facebook.com/' + page.id + '/picture'" />
          </a>
        </div>
        <div class="m-body">
          <a [href]="page.link">
            <b>{{ page.name }}</b
            ><br />
          </a>
          <svg
            width="24"
            height="24"
            viewBox="-2 -2 32 32"
            class="m-facebook-icon"
          >
            <path
              d="M17.9 14h-3v8H12v-8h-2v-2.9h2V8.7C12 6.8 13.1 5 16 5c1.2 0 2 .1 2 .1v3h-1.8c-1 0-1.2.5-1.2 1.3v1.8h3l-.1 2.8z"
            ></path>
          </svg>
          <a
            class="mdl-color-text--red"
            (click)="drop()"
            i18n="@@THIRD_PARTY_NETWORKS__FACEBOOK__DETACH_PAGE_ACTION"
            >Detach page</a
          >
        </div>
      </div>
    </div>

    <div class="setup" *ngIf="!page && !inProgress">
      <div
        class="m-third-party-networks-facebook-button"
        (click)="connect()"
        *ngIf="accounts.length == 0"
      >
        <svg
          width="40"
          height="40"
          viewBox="-2 -2 32 32"
          class="m-facebook-icon"
        >
          <path
            d="M17.9 14h-3v8H12v-8h-2v-2.9h2V8.7C12 6.8 13.1 5 16 5c1.2 0 2 .1 2 .1v3h-1.8c-1 0-1.2.5-1.2 1.3v1.8h3l-.1 2.8z"
          ></path>
        </svg>
        <b i18n="@@THIRD_PARTY_NETWORKS__FACEBOOK__LINK_BOOST"
          >Link your boosts to facebook</b
        >
      </div>

      <b
        *ngIf="accounts.length > 0"
        class="mdl-color-text--blue-grey-400"
        style="text-align: center; margin: 0; display:block;"
        i18n="@@THIRD_PARTY_NETWORKS__FACEBOOK__SELECT_PAGE_LABEL"
        >Select a page to link below
      </b>
      <div class="m-third-party-networks-facebook-pages-list">
        <div
          class="m-block mdl-card mdl-shadow--2dp"
          *ngFor="let account of accounts"
          (click)="selectAccount(account)"
        >
          <div class="m-avatar">
            <img
              [src]="'https://graph.facebook.com/' + account.id + '/picture'"
            />
          </div>
          <div class="m-body">
            <b class="mdl-color-text--blue-grey-400">{{ account.name }}</b>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ThirdPartyNetworksFacebook {
  readonly siteUrl: string;
  done: EventEmitter<any> = new EventEmitter(true);

  page;
  accounts = [];

  inProgress: boolean = false;

  constructor(
    public client: Client,
    private cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
    this.getPage();
  }

  getPage() {
    this.inProgress = true;
    this.client
      .get('api/v1/thirdpartynetworks/facebook/page')
      .then((response: any) => {
        this.inProgress = false;
        if (!response.page) {
          this.page = null;
          return true;
        }
        this.page = response.page;
      });
  }

  connect() {
    this.inProgress = true;
    window.onSuccessCallback = () => {
      this.getAccounts();
    };
    window.open(this.siteUrl + 'api/v1/thirdpartynetworks/facebook/link');
  }

  getAccounts() {
    this.inProgress = true;
    this.client
      .get('api/v1/thirdpartynetworks/facebook/accounts')
      .then((response: any) => {
        this.inProgress = false;
        this.accounts = response.accounts;
        this.cd.detectChanges();
      });
  }

  selectAccount(account) {
    this.inProgress = true;
    this.client
      .post('api/v1/thirdpartynetworks/facebook/select-page', {
        id: account.id,
        name: account.name,
        accessToken: account.access_token,
      })
      .then((response: any) => {
        this.inProgress = false;
        this.page = account;
      });
  }

  drop() {
    this.inProgress = true;
    this.client.delete('api/v1/thirdpartynetworks/facebook').then(() => {
      this.inProgress = false;
      this.page = null;
    });
  }
}
