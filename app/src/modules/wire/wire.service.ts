import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { WireContractService } from '../blockchain/contracts/wire-contract.service';
import { TokenContractService } from '../blockchain/contracts/token-contract.service';

@Injectable()
export class WireService {
  public wireSent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private client: Client,
    private wireContract: WireContractService,
    private tokenContract: TokenContractService
  ) { }

  async submitWire(wire) {
    let payload = wire.payload;

    if (wire.currency == 'tokens') {
      try {
        if (wire.recurring) {
          await this.tokenContract.increaseApproval((await this.wireContract.wire()).address, wire.amount * 11);
          await new Promise(r => setTimeout(r, 1000)); // Metamask has a "cooldown"
        }

        payload.nonce.txHash = await this.wireContract.create(payload.nonce.receiver, wire.amount);
      } catch (e) {
        console.error('[Wire/Token]', e);
        throw new Error('Either you cancelled the approval, or there was an error processing it');
      }
    }

    try {
      let response: any = await this.client.post(`api/v1/wire/${wire.guid}`, {
        payload,
        method: wire.currency,
        amount: wire.amount,
        recurring: wire.recurring
      });

      this.wireSent.next(wire);
      return { done: true };
    } catch (e) {
      if (e && e.stage === 'transaction') {
        throw new Error('Sorry, your payment failed. Please, try again or use another card');
      }

      throw e;
    }
  }
}
