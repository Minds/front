import { Injectable } from '@angular/core';

import { Client } from '../../services/api/client';

@Injectable()
export class OffchainPaymentService {
  constructor(
    protected client: Client
  ) { }

  async create(type, amount) {
    let response: any = await this.client.post(`api/v1/blockchain/transactions/spend`, { type, amount });

    if (!response.txHash) {
      throw new Error('Error processing payment');
    }

    return response.txHash;
  }

  // DI

  static _(client: Client) {
    return new OffchainPaymentService(client);
  }
}
