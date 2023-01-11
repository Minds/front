import { Injectable } from '@angular/core';

import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { BoostContractService } from '../blockchain/contracts/boost-contract.service';

@Injectable()
export class BoostService {
  constructor(
    public session: Session,
    private client: Client,
    private boostContractService: BoostContractService
  ) {}

  /**
   * Returns a promise with a collection of boosts.
   */
  load(
    type: string,
    filter: string,
    {
      limit,
      offset,
      remote,
    }: { limit?: number; offset?: string; remote?: string } = {}
  ): Promise<{ boosts; loadNext }> {
    return this.client
      .get(`api/v2/boost/${type}/${filter}`, {
        limit: limit || 12,
        offset: offset || '',
        remote: remote || '',
      })
      .then(({ boosts, 'load-next': loadNext }) => {
        return {
          boosts: boosts && boosts.length ? boosts : [],
          loadNext: loadNext || '',
        };
      });
  }

  /**
   * Accepts a P2P boost.
   */
  async accept(boost): Promise<boolean> {
    if (this.getBoostType(boost) !== 'p2p') {
      return false;
    }

    try {
      if (boost.currency == 'tokens') {
        let tx = await this.boostContractService.accept(boost.guid);

        if (!tx) {
          return false;
        }
      }

      boost.state = 'accepted';

      await this.client.put(`api/v2/boost/peer/${boost.guid}`);
      return true;
    } catch (e) {
      boost.state = 'created';
      return false;
    }
  }

  /**
   * Returns true if the boost can be accepted by the current user
   */
  canAccept(boost): boolean {
    return (
      boost.state === 'created' &&
      this.getBoostType(boost) === 'p2p' &&
      this.isIncoming(boost)
    );
  }

  /**
   * Rejects a P2P boost.
   */
  async reject(boost): Promise<boolean> {
    if (this.getBoostType(boost) !== 'p2p') {
      return false;
    }

    try {
      if (boost.currency == 'tokens') {
        let tx = await this.boostContractService.reject(boost.guid);

        if (!tx) {
          return false;
        }
      }

      boost.state = 'rejected';

      await this.client.delete(`api/v2/boost/peer/${boost.guid}`);
      return true;
    } catch (e) {
      boost.state = 'created';
      return false;
    }
  }

  /**
   * Returns true if the boost can be rejected by the current user
   */
  canReject(boost): boolean {
    return (
      boost.state === 'created' &&
      this.getBoostType(boost) === 'p2p' &&
      this.isIncoming(boost)
    );
  }

  /**
   * Revokes a boost.
   */
  async revoke(boost): Promise<boolean> {
    let revokeEndpoint;

    if (this.getBoostType(boost) === 'p2p') {
      // P2P
      revokeEndpoint = `api/v2/boost/peer/${boost.guid}/revoke`;
    } else {
      // Network
      revokeEndpoint = `api/v2/boost/${boost.handler}/${boost.guid}/revoke`;
    }

    try {
      if (this.isOnChain(boost)) {
        let tx = await this.boostContractService.revoke(boost.guid);

        if (!tx) {
          return false;
        }
      }

      boost.state = 'revoked';
      await this.client.delete(revokeEndpoint);
      return true;
    } catch (e) {
      boost.state = 'created';
      return false;
    }
  }

  /**
   * Returns true if the boost can be revoked by the current user
   */
  canRevoke(boost): boolean {
    return (
      boost.state === 'created' &&
      ((this.getBoostType(boost) === 'p2p' && !this.isIncoming(boost)) ||
        this.getBoostType(boost) !== 'p2p')
    );
  }

  /**
   * Returns the boost type based on the existance of certain object keys.
   */
  getBoostType(boost): string | false {
    if (boost.handler) {
      return boost.handler;
    } else if (boost.destination) {
      return 'p2p';
    }

    return false;
  }

  /**
   * Returns if the boost belongs to the current logged in user
   */
  isIncoming(boost): boolean {
    return boost.destination.guid === this.session.getLoggedInUser().guid;
  }

  /**
   * Returns true if the transactionid indicates that the transaction is onChain;
   */
  isOnChain = (boost: any) => boost.transactionId.startsWith('0x');
}
