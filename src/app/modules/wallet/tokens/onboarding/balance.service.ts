import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import toFriendlyCryptoVal from '../../../../helpers/friendly-crypto';

// wallet type.
export type Wallet = {
  balance: string;
  address: string;
  label: string;
  ether_balance?: string;
  available?: string;
};

// response from balance endpoint.
export type BalanceResponse = {
  status?: string;
  addresses?: Wallet[];
  balance?: string;
  wireCap?: string;
  boostCap?: string;
  testnetBalance?: string;
};

@Injectable({ providedIn: 'root' })
export class TokenBalanceService {
  // offchain balance.
  public readonly offchain$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  // onchain balance.
  public readonly onchain$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  constructor(private api: ApiService, private toast: ToasterService) {}

  /**
   * Populates service level offchain and onchain balances, and returns observable
   * containing response data from server, either can be consumed.
   * @returns { Observable<BalanceResponse> } - response data from server.
   */
  public fetch(): Observable<BalanceResponse> {
    return this.api
      .get<BalanceResponse>('api/v2/blockchain/wallet/balance')
      .pipe(
        take(1),
        map(response => {
          const addresses = response.addresses;

          for (let address of addresses) {
            if (address.address === 'offchain') {
              this.offchain$.next(toFriendlyCryptoVal(address.balance));
            }
            if (address.address.startsWith('0x')) {
              this.onchain$.next(toFriendlyCryptoVal(address.balance));
            }
          }
          return response;
        }),
        catchError(e => {
          console.error(e);
          this.toast.error(e.error?.message ?? e);
          return of(null);
        })
      );
  }
}
