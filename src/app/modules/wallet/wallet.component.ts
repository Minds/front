import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Storage } from '../../services/storage';
import { Client } from '../../services/api';
import { Session } from '../../services/session';

import { WalletService } from '../../services/wallet';
import { BlockchainService } from '../blockchain/blockchain.service';
import { MetaService } from '../../common/services/meta.service';

@Component({
  moduleId: module.id,
  selector: 'm-wallet',
  templateUrl: 'wallet.component.html',
})
export class WalletComponent {
  disablePointsAnimation: boolean = false;

  constructor(
    private session: Session,
    public storage: Storage,
    private router: Router,
    private metaService: MetaService
  ) {
    this.disablePointsAnimation = !!this.storage.get('disablePointsAnimation');
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.metaService.setTitle('Wallet').setDescription('Minds Wallet');
  }

  // Animations
  setDisablePointsAnimation(value) {
    this.disablePointsAnimation = !!value;
    this.storage.set('disablePointsAnimation', !!value ? '1' : '');
  }
}
