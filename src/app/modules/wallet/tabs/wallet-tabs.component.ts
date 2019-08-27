import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '../../../services/storage';
import { MindsTitle } from '../../../services/ux/title';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-wallet-tabs',
  templateUrl: 'wallet-tabs.component.html'
})
export class WalletTabsComponent {

  disablePointsAnimation: boolean = false;
  
  state = {
    activeOption: 'history'
  }

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

  onOptionSelect = (opt: string) => this.state.activeOption = opt;

  // Animations
  setDisablePointsAnimation(value) {
    this.disablePointsAnimation = !!value;
    this.storage.set('disablePointsAnimation', !!value ? '1' : '');
  }
}
