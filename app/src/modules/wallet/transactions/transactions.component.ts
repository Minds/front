import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-transactions',
  templateUrl: 'transactions.component.html'
})

export class WalletTransactionsComponent {

  type: string = '';
  togglePurchase: boolean = false;
  session = SessionFactory.build();
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, ) { }

  ngOnInit() {
    this.type = 'points';

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['type']) {
        this.type = params['type'];
      }
      if (params['stub'] && params['stub'] === 'purchase') {
        this.togglePurchase = true;
      }
    });

    this.route.url.subscribe(url => {
      if (url[0].path === 'purchase')
        this.togglePurchase = true;

      if (url[0].path === 'transactions' && this.session.getLoggedInUser().merchant) {
        this.router.navigate(['/wallet/revenue']);
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
