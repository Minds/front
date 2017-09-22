import { Injectable } from '@angular/core';

import { Client } from '../../services/api';
import { Session, SessionFactory } from '../../services/session';

@Injectable()
export class BoostService {

  session: Session = SessionFactory.build();

  constructor(private client: Client) { }

  /**
   * Returns a promise with a collection of boosts.
   */
  load(type: string, filter: string, { limit, offset }: { limit?: number, offset?: string } = {}): Promise<{ boosts, loadNext }> {
    return this.client.get(`api/v1/boost/${type}/${filter}`, {
      limit: limit || 12,
      offset: offset || ''
    })
      .then(({ boosts, 'load-next': loadNext }) => {
        return {
          boosts: boosts && boosts.length ? boosts : [],
          loadNext: loadNext || ''
        };
      });
  }

  /**
   * Accepts a P2P boost.
   */
  accept(boost): Promise<boolean> {
    if (this.getBoostType(boost) !== 'p2p') {
      return Promise.resolve(false);
    }

    boost.state = 'accepted';

    return this.client.put(`api/v1/boost/peer/${boost.guid}`)
      .then(() => {
        return true;
      })
      .catch(e => {
        boost.state = 'created';
        return false;
      });
  }

  /**
   * Returns true if the boost can be accepted by the current user
   */
  canAccept(boost): boolean {
    return boost.state === 'created' && this.getBoostType(boost) === 'p2p' && this.isIncoming(boost);
  }

  /**
   * Rejects a P2P boost.
   */
  reject(boost): Promise<boolean> {
    if (this.getBoostType(boost) !== 'p2p') {
      return Promise.resolve(false);
    }

    boost.state = 'rejected';

    return this.client.delete(`api/v1/boost/peer/${boost.guid}`)
      .then(() => {
        return true;
      })
      .catch(e => {
        boost.state = 'created';
        return false;
      });
  }

  /**
   * Returns true if the boost can be rejected by the current user
   */
  canReject(boost): boolean {
    return boost.state === 'created' && this.getBoostType(boost) === 'p2p' && this.isIncoming(boost);
  }

  /**
   * Revokes a boost.
   */
  revoke(boost): Promise<boolean> {
    let revokeEndpoint;

    if (this.getBoostType(boost) === 'p2p') {
      // P2P
      revokeEndpoint = `api/v1/boost/peer/${boost.guid}/revoke`;
    } else {
      // Network
      revokeEndpoint = `api/v1/boost/${boost.handler}/${boost.guid}/revoke`;
    }

    boost.state = 'revoked';

    return this.client.delete(revokeEndpoint)
      .then(() => {
        return true;
      })
      .catch(e => {
        boost.state = 'created';
        return false;
      });
  }

  /**
   * Returns true if the boost can be revoked by the current user
   */
  canRevoke(boost): boolean {
    return boost.state === 'created' && (
      (this.getBoostType(boost) === 'p2p' && !this.isIncoming(boost)) ||
      (this.getBoostType(boost) !== 'p2p')
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

}
