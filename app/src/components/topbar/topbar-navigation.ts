import { Component, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Navigation as NavigationService } from '../../services/navigation';
import { WalletService } from '../../services/wallet';
import { SessionFactory } from '../../services/session';
import { Storage } from '../../services/storage';

import { NotificationsTopbarToggleComponent } from '../../modules/notifications/toggle.component';

import { animations } from '../../animations';

@Component({
  selector: 'minds-topbar-navigation',
  templateUrl: 'topbar-navigation.component.html',
  animations: animations
})

export class TopbarNavigation implements AfterViewInit, OnDestroy {

  user;
  session = SessionFactory.build();
  walletPopContent: string = '';
  walletPopState: any;

  // Wallet-specific
  private walletSubscription: Subscription;

  // -- Wallet animation
  private queueWalletAnimationTimer;
  private queueWalletAnimationPoints: number = 0;

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

  playWalletAnimation(points: number) {
    this.walletPopContent = `+${points}`;
    this.walletPopState = Date.now();
  }

}
