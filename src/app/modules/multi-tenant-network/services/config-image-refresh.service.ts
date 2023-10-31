import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for tracking counts of config image refreshes.
 * This allows images used as background images to be refreshed, by updating
 * a query parameter with the count to cache-bust.
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantConfigImageRefreshService {
  /** Count of times square logo has been uploaded.  */
  public squareLogoCount$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);
  /** Count of times favicon has been uploaded.  */
  public faviconCount$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  /** Count of times horizontal logo has been uploaded.  */
  public horizontalLogoCount$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);

  /**
   * Increments the count of the square logo.
   * @returns { void }
   */
  public incremenetSquareLogoCount(): void {
    this.squareLogoCount$.next(this.squareLogoCount$.getValue() + 1);
  }

  /**
   * Increments the count of the favicon.
   * @returns { void }
   */
  public incremenetFaviconCount(): void {
    this.faviconCount$.next(this.faviconCount$.getValue() + 1);
  }

  /**
   * Increments the count of the horizontal logo.
   * @returns { void }
   */
  public incremenetHorizontalLogoCount(): void {
    this.horizontalLogoCount$.next(this.horizontalLogoCount$.getValue() + 1);
  }
}
