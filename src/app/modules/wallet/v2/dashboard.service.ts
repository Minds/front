import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
} from 'rxjs/operators';
import { MindsHttpClient } from '../../../common/api/client.service';
import fakeData from './fake-data';
import {
  Response,
  UserState,
  ShadowboxHeaderTab,
} from '../../../interfaces/dashboard';

@Injectable()
export class WalletDashboardService {
  constructor(private http: MindsHttpClient) {
    // this.loadFromRemote();
  }

  getTokenChartData(activeTimespan) {
    return fakeData.visualisation;
  }

  getCurrencySubtotals() {
    const currencySubtotals: ShadowboxHeaderTab[] = [
      {
        id: 'tokens',
        label: 'Tokens',
        unit: 'tokens',
      },
      {
        id: 'usd',
        label: 'USD',
        unit: 'usd',
      },
      {
        id: 'eth',
        label: 'Ether',
        unit: 'eth',
      },
      {
        id: 'btc',
        label: 'Bitcoin',
      },
    ];

    currencySubtotals[0].value = this.getTokenSubtotal();
    currencySubtotals[1].value = this.getUsdSubtotal();
    currencySubtotals[2].value = this.getEthSubtotal();

    return currencySubtotals;
  }

  private getTokenSubtotal() {
    // see WalletBalanceTokensComponent loadLocal(), loadRemote()
    return 2167.457;
  }

  private getUsdSubtotal() {
    // get from Mark after Stripe update
    return 13577;
  }

  private getEthSubtotal() {
    // see WalletBalanceTokensComponent loadEth()
    return 15.3570957;
  }
}
