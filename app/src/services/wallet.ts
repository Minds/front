import { Inject, Injector, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Client } from './api';
import { SessionFactory } from './session';
import { SocketsService } from './sockets';

export class WalletService {

  points: number | null = null;
  session = SessionFactory.build();

  apiInProgress: boolean = false;
  private pointsEmitter: EventEmitter<{ batch, total }> = new EventEmitter<{ batch, total }>();
  private pointsTxSubscription: Subscription;

  static _(client: Client, sockets: SocketsService) {
    return new WalletService(client, sockets);
  }

  constructor( @Inject(Client) public client: Client, @Inject(SocketsService) private sockets: SocketsService) {
    this.getBalance();

    this.session.isLoggedIn((is) => {
      if (is) {
        this.getBalance(true);
      } else {
        this.points = null;
        this.sync();
      }
    });

    this.listen();
  }

  onPoints(): EventEmitter<{ batch, total }> {
    return this.pointsEmitter;
  }

  delta(points: number) {
    if (this.points === undefined) {
      return;
    }

    if (points === 0) {
      return;
    }

    this.points += points;
    this.sync(points);
  }

  /**
   * Increment the wallet
   */
  increment(points: number = 1) {
    this.delta(+points);
  }

  /**
   * Decrement the wallet
   */
  decrement(points: number = 1) {
    this.delta(-points);
  }

  /**
   * Return the balance
   */
  getBalance(refresh: boolean = false): Promise<number | null> {
    if (!window.Minds.wallet || refresh) {
      this.points = null;
      this.apiInProgress = true;

      return this.client.get(`api/v1/wallet/count`)
        .then(({ count }) => {
          this.apiInProgress = false;

          if (typeof count === 'undefined') {
            this.points = null;
          } else {
            this.points = count;
          }

          this.sync();
          return this.points;
        })
        .catch(e => {
          this.apiInProgress = false;

          this.points = null;
          this.sync();
        });
    } else if (this.points === null) {
      this.points = window.Minds.wallet.balance;

      this.sync();
      return Promise.resolve(this.points);
    }
  }

  sync(points?: number | null) {
    this.pointsEmitter.emit({ batch: points, total: this.points });
  }

  // real-time
  listen() {
    this.pointsTxSubscription = this.sockets.subscribe('pointsTx', (points, entity_guid, description) => {
      if (this.apiInProgress) {
        return;
      }

      this.delta(points);
    });
  }

  // @todo: when? implement at some global ngOnDestroy()
  unListen() {
    if (this.pointsTxSubscription) {
      this.pointsTxSubscription.unsubscribe();
    }
  }

}
