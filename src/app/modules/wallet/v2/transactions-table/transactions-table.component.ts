import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-walletTransactionsTable',
  templateUrl: './transactions-table.component.html',
})
export class WalletTransactionsTableComponent implements OnInit {
  @Input() currency: string;
  @Input() transactions: any;

  constructor() {}

  ngOnInit() {}

  // load the data
  // from api

  // if there are no transactions, show something else

  // if there are transactions
  // route to either formatUSD or formatTokens

  // formatUSD
}
