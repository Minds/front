import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../services/api/client';

@Injectable()
export class WireService {
  public wireSent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private client: Client) {

  }

  submitWire(wire) {
    return this.client.post(`api/v1/wire/${wire.guid}`, {
      payload: wire.payload,
      method: wire.currency,
      amount: wire.amount,
      recurring: wire.recurring
    })
      .then(response => {
        this.wireSent.next(wire);
        return { done: true };
      })
      .catch(e => {
        if (e && e.stage === 'transaction') {
          throw new Error('Sorry, your payment failed. Please, try again or use another card');
        }

        throw e;
      });
  }
}
