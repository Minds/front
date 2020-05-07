import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchAll,
} from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';

/**
 *
 */
export type SupportTierCurrency = 'tokens' | 'usd';

/**
 *
 */
export interface SupportTier {
  urn: string;
  entity_guid: string;
  currency: SupportTierCurrency;
  guid: string;
  amount: number;
  name: string;
  description: string;
}

/**
 *
 */
export interface GroupedSupportTiers {
  tokens: Array<SupportTier>;
  usd: Array<SupportTier>;
}

/**
 *
 */
@Injectable()
export class SupportTiersService {
  /**
   *
   */
  readonly entityGuid$: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  /**
   *
   */
  readonly list$: Observable<Array<SupportTier>>;

  /**
   *
   */
  readonly groupedList$: Observable<GroupedSupportTiers>;

  /**
   * Constructor. Set observables.
   * @param api
   */
  constructor(protected api: ApiService) {
    // Fetch Support Tiers list
    this.list$ = this.entityGuid$.pipe(
      distinctUntilChanged(),
      map(
        (entityGuid: string): Observable<ApiResponse> =>
          entityGuid
            ? this.api.get(`api/v3/wire/supporttiers/${entityGuid}`)
            : of(null)
      ),
      switchAll(),
      shareReplay({ bufferSize: 1, refCount: true }),
      map(response => this.parseApiResponse(response && response.support_tiers))
    );

    // Grouped
    this.groupedList$ = this.list$.pipe(
      map(supportTiers => ({
        tokens: supportTiers.filter(
          supportTier => supportTier.currency === 'tokens'
        ),
        usd: supportTiers.filter(supportTier => supportTier.currency === 'usd'),
      }))
    );
  }

  /**
   *
   * @param entityGuid
   */
  setEntityGuid(entityGuid: string) {
    this.entityGuid$.next(entityGuid);
  }

  /**
   * Transforms wire_threshold/wire_rewards type to Support Tier currency
   * @param monetizationType
   */
  toSupportTierCurrency(
    monetizationType: 'tokens' | 'money'
  ): SupportTierCurrency {
    switch (monetizationType) {
      case 'money':
        return 'usd';

      default:
        return monetizationType;
    }
  }

  /**
   * Transforms Support Tier currency to wire_threshold/wire_rewards type
   * @param supportTierCurrency
   */
  toMonetizationType(
    supportTierCurrency: SupportTierCurrency
  ): 'tokens' | 'money' {
    switch (supportTierCurrency) {
      case 'usd':
        return 'money';

      default:
        return supportTierCurrency;
    }
  }

  /**
   *
   * @param supportTiers
   */
  protected parseApiResponse(
    supportTiers: Array<SupportTier>
  ): Array<SupportTier> {
    if (!supportTiers) {
      return [];
    }

    return supportTiers.sort((a, b) => {
      if (a.currency === b.currency) {
        return a.amount - b.amount;
      }

      return a.currency < b.currency ? -1 : 1;
    });
  }
}
