import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'minds-wallet-transactions',
  templateUrl: 'transactions.component.html'
})

export class WalletTransactions {
  type: string = '';

  constructor(public route: ActivatedRoute) { }

  paramsSubscription: Subscription;
  ngOnInit() {
    this.type = 'points';

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['type']) {
        this.type = params['type'];
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
