import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-walletPendingUsdPayout',
  templateUrl: './pending-usd-payout.component.html',
})
export class WalletPendingUsdPayoutComponent implements OnInit {
  @Input() pendingTransactions;
  constructor() {}

  ngOnInit() {}
}
