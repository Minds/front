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
 * Support Tier entity
 */
export interface SupportTier {
  urn: string;
  entity_guid: string;
  guid: string;
  public: boolean;
  name: string;
  description: string;
  usd: number;
  has_usd: boolean;
  tokens?: number;
  has_tokens: boolean;
  posts?: number;
  supporters?: number;
}

/**
 * Supported currencies
 */
export type SupportTierCurrency = 'tokens' | 'usd';

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
   * Current entity GUID
   */
  readonly entityGuid$: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  /**
   * List of Support Tiers as they come from API
   */
  readonly list$: Observable<Array<SupportTier>>;

  /**
   * Grouped by currency Support Tier list
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
            ? this.api.get(`api/v3/wire/supporttiers/all/${entityGuid}`)
            : of(null)
      ),
      switchAll(),
      shareReplay({ bufferSize: 1, refCount: true }),
      map(response => (response && response.support_tiers) || [])
    );

    // Grouped
    this.groupedList$ = this.list$.pipe(
      map(supportTiers => ({
        tokens: supportTiers.filter(supportTier => supportTier.has_tokens),
        usd: supportTiers.filter(supportTier => supportTier.has_usd),
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
}
