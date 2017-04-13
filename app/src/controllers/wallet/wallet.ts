import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { Subscription } from 'rxjs/Rx';

import { Storage } from '../../services/storage';
import { Client } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { SessionFactory } from '../../services/session';

import { WalletService } from '../../services/wallet';


@Component({
  moduleId: module.id,
  selector: 'minds-wallet',
  templateUrl: 'wallet.html'
})

export class Wallet {

  session = SessionFactory.build();

  filter : string = "transactions";
  points : Number = 0;
  transactions : Array<any> = [];
  offset: string = "";
  inProgress : boolean = false;
  moreData : boolean = true;

  disablePointsAnimation: boolean = false;

  constructor(public client: Client, public wallet: WalletService, public router: Router, public route: ActivatedRoute, public title: MindsTitle, public storage: Storage) {
    this.disablePointsAnimation = !!this.storage.get('disablePointsAnimation');
  }
  
  paramsSubscription: Subscription;
  ngOnInit() {
    if(!this.session.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }

    this.title.setTitle("Wallet | Minds");

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        this.filter = params['filter'];
      }
    });

    this.wallet.getBalance(true);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  // Animations
  setDisablePointsAnimation(value) {
    this.disablePointsAnimation = !!value;
    this.storage.set('disablePointsAnimation', !!value ? '1' : '');
  }
}
