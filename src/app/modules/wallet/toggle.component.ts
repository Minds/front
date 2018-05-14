import { Component, EventEmitter, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { Navigation as NavigationService } from '../../services/navigation';
import { WalletService } from './wallet.service';
import { Session } from '../../services/session';
import { Storage } from '../../services/storage';

import { animations } from '../../animations';

@Component({
  selector: 'm-wallet--topbar-toggle',
  templateUrl: 'toggle.component.html',
  animations: animations
})

export class WalletToggleComponent implements AfterViewInit, OnDestroy {

  user;
  walletPopContent: string = '';
  walletPopState: any;
  balance: number = 0;
  toggled: boolean = false;

  // Wallet-specific
  private walletSubscription: Subscription;

  // -- Wallet animation
  private queueWalletAnimationTimer;
  private queueWalletAnimationPoints: number = 0;

  constructor(public session: Session, public wallet: WalletService, public storage: Storage) { }

  ngAfterViewInit() {
    this.walletListen();
  }

  ngOnDestroy() {
    this.walletUnListen();
  }

  walletListen() {
    this.walletSubscription = this.wallet.onPoints().subscribe(({ batch, total }) => {
      if (total === null) {
        total = '…';
      }

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

  toggle() {
    this.toggled = !this.toggled;
  }

}
