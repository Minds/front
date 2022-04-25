import { isPlatformServer } from '@angular/common';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

const DEFAULT_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export type DismissIdentifier =
  | 'top-highlights'
  | 'channel-recommendation:feed'
  | 'channel-recommendation:channel';

type DismissItem = {
  id: DismissIdentifier;
  expiry: number;
};

/**
 * A general service to manage dismissal of components, widgets, or notices
 */
@Injectable({
  providedIn: 'root',
})
export class DismissalService {
  static STORAGE_KEY = 'dismissal-service:dismisses';
  private dismisses$: BehaviorSubject<DismissItem[]> = new BehaviorSubject([]);

  constructor(@Inject(PLATFORM_ID) platformId: string) {
    if (!isPlatformServer(platformId)) {
      this._rehydrateAndPersist();
    }
  }

  /**
   * Returns a list of ids of items that are dismissed
   * @returns { [DismissIdentifier] } dismissed items
   */
  get dismissedItems$(): Observable<DismissIdentifier[]> {
    return this.dismisses$.pipe(
      map(dismisses =>
        dismisses.filter(item => Date.now() <= item.expiry).map(item => item.id)
      )
    );
  }

  /**
   * Whether an item is dismissed
   * @param { DismissIdentifier } id
   * @returns { boolean }
   */
  isDismissed(id: DismissIdentifier): boolean {
    const widget = this.dismisses$
      .getValue()
      .find(dismissedItem => dismissedItem.id === id);
    if (!widget) return false;

    return Date.now() <= widget.expiry;
  }

  /**
   * Dismisses an item for some time
   * @param { string } id - a unique id
   * @param { number } duration - a duration in milliseconds until which this item shouldn't be shown
   */
  dismiss(id: DismissIdentifier, duration: number = DEFAULT_DURATION) {
    this.dismisses$.next([
      ...this.dismisses$.getValue(),
      { id, expiry: Date.now() + duration },
    ]);
    this._persist();
  }

  /**
   * Restores state from localstorage
   */
  private _rehydrateAndPersist(): void {
    try {
      const dismissesStringified = localStorage.getItem(
        DismissalService.STORAGE_KEY
      );
      if (dismissesStringified) {
        const dismisses = JSON.parse(dismissesStringified).filter(
          item => item.expiry <= Date.now()
        ) as DismissItem[];
        this.dismisses$.next(dismisses);
        this._persist();
      }
    } catch (e) {
      console.error(
        '[DismissalService] something went wrong while rehydrating',
        e
      );
    }
  }

  /**
   * Persists state by writing to localstorage
   */
  private _persist(): void {
    try {
      localStorage.setItem(
        DismissalService.STORAGE_KEY,
        JSON.stringify(this.dismisses$.getValue())
      );
    } catch (e) {
      console.error(
        '[DismissalService] something went wrong while rehydrating',
        e
      );
    }
  }
}
