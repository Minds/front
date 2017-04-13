import { Component, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from "rxjs/Rx";

import { Navigation as NavigationService } from '../../services/navigation';
import { WalletService } from "../../services/wallet";
import { SessionFactory } from '../../services/session';
import { Storage } from '../../services/storage';

import { animations } from "../../animations";

@Component({
  selector: 'minds-topbar-navigation',
  template: `
    <nav class="" *ngIf="session.isLoggedIn()">

    <a *ngFor="let item of navigation.getItems('topbar')" class="mdl-color-text--blue-grey-500"
      [routerLink]="[item.path, item.params]"
    >
      <i class="material-icons" [ngClass]="{'mdl-color-text--amber-300' : item.extras?.counter > 0 && item.name == 'Notifications'}">{{item.icon}}</i>
      <span id="{{item.name | lowercase}}-counter" class="counter mdl-color-text--green-400" *ngIf="item.extras">{{item.extras?.counter | abbr}}</span>
      <span class="mdl-color--blue-grey-500 mdl-color-text--white m-wallet-pop"
        *ngIf="item.name === 'Wallet'"
        [hidden]="!walletPopContent"
        [@foolishIn]="walletPopState"
        (@foolishIn.done)="walletPopContent = ''"
        #walletPop
      >{{ walletPopContent }}</span>
    </a>

    </nav>
  `,
  animations: animations
})

export class TopbarNavigation implements AfterViewInit, OnDestroy {

  user;
  session = SessionFactory.build();

  constructor(public navigation: NavigationService, public wallet: WalletService, public storage: Storage) { }

  ngAfterViewInit() {
    this.walletListen();
  }

  ngOnDestroy() {
    this.walletUnListen();
  }

  setCounter(name, value) {
    this.navigation.getItems('topbar').forEach((item) => {
      if (item.name !== name) {
        return;
      }

      item.extras.counter = value;
    });
  }

  // Wallet-specific
  private walletSubscription: Subscription;

  walletListen() {
    this.walletSubscription = this.wallet.onPoints().subscribe(({ batch, total }) => {
      if (total === null) {
        total = '…';
      }

      this.setCounter('Wallet', total);

      if (batch && !this.storage.get('disablePointsAnimation')) {
        this.queueWalletAnimation(batch);
      }
    });
  }

  walletUnListen() {
    if (this.walletSubscription) {
      this.walletSubscription.unsubscribe();
    }
  }

  // -- Wallet animation
  private queueWalletAnimationTimer;
  private queueWalletAnimationPoints: number = 0;
  queueWalletAnimation(points: number) {
    if (this.queueWalletAnimationTimer) {
      clearTimeout(this.queueWalletAnimationTimer);
    }

    this.queueWalletAnimationPoints += points;

    this.queueWalletAnimationTimer = setTimeout(() => {
      if (this.queueWalletAnimationPoints > 0) {
        this.playWalletAnimation(this.queueWalletAnimationPoints);
      }

      this.queueWalletAnimationPoints = 0;
    }, 1000);
  }

  walletPopContent: string = '';
  walletPopState: any;

  playWalletAnimation(points: number) {
    this.walletPopContent = `+${points}`;
    this.walletPopState = Date.now();
  }
}
