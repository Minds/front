import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';
import { MindsTitle } from '../../../services/ux/title';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-wallet-settings',
  templateUrl: 'wallet-settings.component.html',
})
export class WalletSettingsComponent {
  state = {
    phoneVerified: false,
  };

  disablePointsAnimation: boolean = false;

  constructor(
    private session: Session,
    public storage: Storage,
    private router: Router,
    private title: MindsTitle
  ) {
    this.disablePointsAnimation = !!this.storage.get('disablePointsAnimation');
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    // Set default currency.
    this.title.setTitle('Wallet Settings');
  }

  // onCurrencySelect = (currency: Object) => this.state.activeCurrency = currency;

  // Animations
  setDisablePointsAnimation(value) {
    this.disablePointsAnimation = !!value;
    this.storage.set('disablePointsAnimation', !!value ? '1' : '');
  }
}
