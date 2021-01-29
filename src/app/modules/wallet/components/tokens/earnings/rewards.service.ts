import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../common/api/api.service';

@Injectable()
export class WalletTokenRewardsService {
  constructor(private api: ApiService) {}

  async load(date?: string): Promise<any> {
    const opts: { date?: string } = {};

    if (date) {
      opts.date = date;
    }

    return this.api.get('api/v3/rewards', opts).toPromise();
  }
}
