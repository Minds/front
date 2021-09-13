import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';
import {
  Wallet,
  WalletV2Service,
} from '../wallet/components/wallet-v2.service';
import isMobile from '../../helpers/is-mobile';

@Component({
  selector: 'm-governance',
  templateUrl: './governance.component.html',
})
export class GovernanceComponent implements OnInit {
  tokenBalance;
  routerEventsSubscription;
  mobile = false;

  constructor(public router: Router, private walletService: WalletV2Service) {}

  ngOnInit() {
    this.routerEventsSubscription = this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        pairwise(),
        filter((events: RouterEvent[]) => events[0].url === events[1].url),
        startWith('Initial call')
      )
      .subscribe(async () => {
        this.walletService.wallet$.subscribe((wallet: Wallet) => {
          this.tokenBalance = wallet.onchain.balance;
        });
      });
    if (isMobile()) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  goToCreate() {
    this.router.navigate(['/governance/create']);
  }

  isDetailScreen() {
    return !this.router.url.includes('/governance/proposal/');
  }

  hasToken() {
    return this.tokenBalance > 1;
  }
}
