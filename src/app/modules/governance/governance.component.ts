import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';
import { Wallet, WalletV2Service } from '../wallet/components/wallet-v2.service';

@Component({
  selector: 'm-governance',
  templateUrl: './governance.component.html',
})
export class GovernanceComponent implements OnInit {
  tokenBalance;
  routerEventsSubscription

  constructor(public router: Router, private walletService: WalletV2Service
  ) { }

  ngOnInit() {
    this.routerEventsSubscription = this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        pairwise(),
        filter((events: RouterEvent[]) => events[0].url === events[1].url),
        startWith('Initial call')
      )
      .subscribe(async () => {
        this.walletService.wallet$.subscribe(
          (wallet: Wallet) => {
            this.tokenBalance = wallet.onchain.balance;
          }
        );
      });
  }

  goToCreate() {
    this.router.navigate(['/governance/create']);
  }

  public isDetailScreen() {
    if (this.router.url.includes('/governance/proposal/')) {
      return false;
    } else {
      return true;
    }
  }
}
