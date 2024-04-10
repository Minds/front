import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';

export type TokenPrices = {
  minds: number;
  eth: number;
};

@Injectable({ providedIn: 'root' })
export class TokenPricesService {
  tokenPrices: Observable<TokenPrices> = this.api
    .get('api/v3/blockchain/token-prices')
    .pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      map((response) => {
        return {
          minds: response.minds,
          eth: response.eth,
        };
      })
    );

  eth$: Observable<number> = this.tokenPrices.pipe(
    map((tokenPrice) => tokenPrice.eth)
  );
  minds$: Observable<number> = this.tokenPrices.pipe(
    map((tokenPrice) => tokenPrice.minds)
  );

  /** Eth Price */
  eth: number;

  /** Token Price */
  minds: number;

  requested = false;

  constructor(private api: ApiService) {}

  /**
   * Fetches the token price from the server
   * Will only fetch once
   */
  async get(): Promise<void> {
    if (this.requested) return;
    this.requested = true;

    this.minds = await this.minds$.toPromise();
    this.eth = await this.eth$.toPromise();
  }
}
