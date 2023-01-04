import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import {
  Boost,
  BoostConsoleLocationFilterType,
  BoostConsoleStateFilterType,
  BoostConsoleSuitabilityFilterType,
} from '../../boost.types';

/**
 * Service that handles logic for the boost console
 */
@Injectable()
export class BoostConsoleService {
  // Subject containing whether or not we are viewing
  // the boost console in the context of the admin console
  // (as opposed to user context)
  public readonly adminContext$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Subject containing location filter for console to display.
  // (e.g. newsfeed or sidebar)
  public readonly locationFilterValue$: BehaviorSubject<
    BoostConsoleLocationFilterType
  > = new BehaviorSubject<BoostConsoleLocationFilterType>('newsfeed');

  // Subject containing status filter for console to display.
  // (Used in user boost context only)
  public readonly stateFilterValue$: BehaviorSubject<
    BoostConsoleStateFilterType
  > = new BehaviorSubject<BoostConsoleStateFilterType>('all');

  // Subject containing suitability filter for console to display.
  // (Used in admin context only)
  public readonly suitabilityFilterValue$: BehaviorSubject<
    BoostConsoleSuitabilityFilterType
  > = new BehaviorSubject<BoostConsoleSuitabilityFilterType>('safe');

  constructor(public session: Session, private client: Client) {}
  /**
   * Returns a promise with a collection of boosts.
   */
  loadBoosts(
    stateFilter: string,
    suitabilityFilter: string,
    locationFilter: string,
    { limit, offset }: { limit?: number; offset?: string } = {}
  ): Promise<{ boosts; loadNext }> {
    let endpoint = 'api/v3/boosts';
    let state = '';
    let suitability = '';

    if (stateFilter) {
      // ojm get number
      // ojm use query param array instead of manually adding prefixes
      state = '?status=1';
    }

    if (suitabilityFilter) {
      // ojm get number
      const prefix = stateFilter ? '&' : '?';
      suitability = `${prefix}audience=1`;
    }

    if (locationFilter) {
      // ojm get number
      const prefix = locationFilter ? '&' : '?';
      suitability = `${prefix}audience=1`;
    }

    return this.client
      .get(`${endpoint}${status}${suitability}`, {
        limit: limit || 12,
        offset: offset || '',
      })
      .then(({ boosts, 'load-next': loadNext }) => {
        return {
          boosts: boosts && boosts.length ? boosts : [],
          loadNext: loadNext || '',
        };
      });
  }

  getTimeTilExpiration(boost: Boost) {
    return 'ojm temp 2 days';
  }

  /**
   * Approves a boost (action taken by admin)
   * @param boost
   * @returns boolean
   */
  approve(boost: Boost) {
    // ojm todo
    return true;
  }

  /**
   * Rejects a boost (action taken by admin)
   * @param boost
   * @returns boolean
   */
  reject(boost: Boost) {
    // ojm todo
    return true;
  }

  /**
   * Cancels a boost (that hasn't yet been approved)
   * @param boost
   * @returns boolean
   */
  cancel(boost: Boost) {
    // ojm todo
    return true;
  }
}
