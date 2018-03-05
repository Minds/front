import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Storage } from '../../services/storage';
import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';

import { WalletService } from '../../services/wallet';
import { BlockchainService } from '../blockchain/blockchain.service';


@Component({
  moduleId: module.id,
  selector: 'm-wallet',
  templateUrl: 'wallet.component.html'
})

export class WalletComponent {

  disablePointsAnimation: boolean = false;

  constructor(
    private session: Session,
    public storage: Storage,
    private router: Router,
    private title: MindsTitle,
  ) {
    this.disablePointsAnimation = !!this.storage.get('disablePointsAnimation');
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.title.setTitle('Wallet');
  }


  // Animations
  setDisablePointsAnimation(value) {
    this.disablePointsAnimation = !!value;
    this.storage.set('disablePointsAnimation', !!value ? '1' : '');
  }
}
