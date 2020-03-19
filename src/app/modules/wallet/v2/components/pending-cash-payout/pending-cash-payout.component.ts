import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-walletPendingCashPayout',
  templateUrl: './pending-cash-payout.component.html',
})
export class WalletPendingCashPayoutComponent implements OnInit {
  @Input() pendingTransactions;
  constructor() {}

  ngOnInit() {}
}
