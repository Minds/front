import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Service for updating the last cache timestamp locally for config images.
 * This allows images used as background images to be refreshed, by updating
 * a query parameter with the timestamp to cache-bust.
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantConfigImageRefreshService {
  constructor(config: ConfigsService) {
    const lastCacheTimestamp: number = config.get<number>('last_cache');
    this.squareLogoLastCacheTimestamp$.next(lastCacheTimestamp);
    this.faviconLastCacheTimestamp$.next(lastCacheTimestamp);
    this.horizontalLogoLastCacheTimestamp$.next(lastCacheTimestamp);
  }

  /** Last cache timestamp for the square logo. */
  public squareLogoLastCacheTimestamp$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  /** Last cache timestamp for the favicon. */
  public faviconLastCacheTimestamp$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  /** Last cache timestamp for the horizontal logo. */
  public horizontalLogoLastCacheTimestamp$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  /**
   * Updates the last cache timestamp for the square logo.
   * @returns { void }
   */
  public updateSquareLogoLastCacheTimestamp(): void {
    this.squareLogoLastCacheTimestamp$.next(Date.now());
  }

  /**
   * Updates the last cache timestamp for the favicon.
   * @returns { void }
   */
  public updateFaviconLastCacheTimestamp(): void {
    this.faviconLastCacheTimestamp$.next(Date.now());
  }

  /**
   * Updates the last cache timestamp for the horizontal logo.
   * @returns { void }
   */
  public updateHorizontalLogoLastCacheTimestamp(): void {
    this.horizontalLogoLastCacheTimestamp$.next(Date.now());
  }
}
