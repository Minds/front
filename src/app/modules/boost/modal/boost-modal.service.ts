import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';

export type BoostSubject = 'channel' | 'post' | '';
export type BoostTab = 'newsfeed' | 'offer';
export type BoostPaymentMethod = 'onchain' | 'offchain';

export type BoostWallet = {
  balance: string;
  address: string;
  label: string;
  ether_balance?: string;
  available?: string;
};

export type BalanceResponse = {
  status?: string;
  addresses?: BoostWallet[];
  balance?: string;
  wireCap?: string;
  boostCap?: string;
  testnetBalance?: string;
};

@Injectable({ providedIn: 'root' })
export class BoostModalService {
  public readonly subject$: BehaviorSubject<BoostSubject> = new BehaviorSubject<
    BoostSubject
  >('');
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public readonly activeTab$: BehaviorSubject<BoostTab> = new BehaviorSubject<
    BoostTab
  >('newsfeed');
  public readonly paymentMethod$: BehaviorSubject<
    BoostPaymentMethod
  > = new BehaviorSubject<BoostPaymentMethod>('onchain');

  constructor(private api: ApiService) {}

  public getBalance(): Observable<BalanceResponse> {
    return this.api.get('api/v2/blockchain/wallet/balance').pipe(
      take(1),
      catchError(e => this.handleError(e))
    );
  }

  private handleError(e): Observable<unknown> {
    console.error(e);
    return of(null);
  }
}
