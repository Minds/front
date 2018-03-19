import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'm-wallet--tokens',
  templateUrl: 'tokens.component.html'
})
export class WalletTokensComponent {
  showOnboarding: boolean = false;

  constructor(route: ActivatedRoute) {
    route.url.subscribe(() => {
      this.showOnboarding = route.snapshot.firstChild && route.snapshot.firstChild.routeConfig.path === 'transactions';
    });
  }
}
