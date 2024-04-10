import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchAll,
  tap,
} from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { deepDiff } from '../../../helpers/deep-diff';

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
  expires?: number;
  subscription_urn?: string;
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
   * List has been loaded
   */
  readonly loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
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
   * Cache buster
   */
  readonly refresh$: BehaviorSubject<number> = new BehaviorSubject<number>(
    Date.now()
  );

  /**
   * Constructor. Set observables.
   * @param api
   */
  constructor(protected api: ApiService) {
    // Fetch Support Tiers list
    this.list$ = combineLatest([this.entityGuid$, this.refresh$]).pipe(
      distinctUntilChanged(deepDiff),
      map(
        ([entityGuid, refresh]): Observable<ApiResponse> =>
          entityGuid
            ? this.api.get(`api/v3/wire/supporttiers/all/${entityGuid}`)
            : of(null)
      ),
      tap(() => this.loaded$.next(true)),
      switchAll(),
      shareReplay({ bufferSize: 1, refCount: true }),
      map((response) => (response && response.support_tiers) || [])
    );

    // Grouped
    this.groupedList$ = this.list$.pipe(
      map((supportTiers) => ({
        tokens: supportTiers.filter((supportTier) => supportTier.has_tokens),
        usd: supportTiers.filter((supportTier) => supportTier.has_usd),
      }))
    );
  }

  /**
   * Sets the entity GUID
   * @param entityGuid
   */
  setEntityGuid(entityGuid: string) {
    this.entityGuid$.next(entityGuid);
  }

  /**
   * Busts cache
   */
  refresh() {
    this.refresh$.next(Date.now());
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
   * Gets payment types as array.
   * @param { BehaviorSubject<SupportTier> } supportTier$ - observable support tier to check.
   * @returns { Observable<SupportTierCurrency[]> } - array of support tier currencies ['usd', 'tokens'] etc.
   */
  public getPaymentTypes$(
    supportTier$: BehaviorSubject<SupportTier>
  ): Observable<SupportTierCurrency[]> {
    return combineLatest([supportTier$, this.groupedList$]).pipe(
      map(([supportTier, groupedList]) => {
        let arr: SupportTierCurrency[] = [];
        if (
          groupedList.tokens.filter((val) => val.urn === supportTier.urn)
            ?.length > 0
        ) {
          arr.push('tokens');
        }

        if (
          groupedList.usd.filter((val) => val.urn === supportTier.urn)?.length >
          0
        ) {
          arr.push('usd');
        }

        return arr;
      })
    );
  }
}
