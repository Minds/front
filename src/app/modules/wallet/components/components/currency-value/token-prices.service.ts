import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../common/api/api.service';

@Injectable({ providedIn: 'root' })
export class TokenPricesService {
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

    const response = <{ status: string; minds: number; eth: number }>(
      await this.api.get('api/v3/blockchain/token-prices').toPromise()
    );
    this.minds = response.minds;
    this.eth = response.eth;
  }
}
