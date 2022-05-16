import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../components/abstract-subscriber/abstract-subscriber.component';

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
export class DismissalService extends AbstractSubscriberComponent {
  static STORAGE_KEY = 'dismissal-service:dismisses';
  private dismisses$: BehaviorSubject<DismissItem[]> = new BehaviorSubject([]);

  constructor(@Inject(PLATFORM_ID) platformId: string) {
    super();
    if (!isPlatformServer(platformId)) {
      this._rehydrateAndPersist();
    }
  }

  /**
   * Returns a list of ids of items that are dismissed
   * @returns { [DismissIdentifier] } dismissed items
   */
  dismissedItems$ = this.dismisses$.pipe(
    map(dismisses =>
      dismisses.filter(item => Date.now() <= item.expiry).map(item => item.id)
    )
  );

  /**
   * Whether an item is dismissed
   * @param { DismissIdentifier } id
   * @returns { Observable<boolean> }
   */
  isDismissed(id: DismissIdentifier): Observable<boolean> {
    return this.dismissedItems$.pipe(
      map(dismissedItems => dismissedItems.includes(id))
    );
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
        const dismisses = JSON.parse(dismissesStringified)
          // discard expired dismisses
          .filter(item => item.expiry >= Date.now()) as DismissItem[];
        this.dismisses$.next(dismisses);
      }
      this.subscriptions.push(this._persist());
    } catch (e) {
      console.error(
        '[DismissalService] something went wrong while rehydrating',
        e
      );
    }
  }

  /**
   * Watches the dismisses$ and persists its state by writing to localstorage
   */
  private _persist(): Subscription {
    return this.dismisses$.pipe(debounceTime(500)).subscribe(dismisses => {
      try {
        localStorage.setItem(
          DismissalService.STORAGE_KEY,
          JSON.stringify(dismisses)
        );
      } catch (e) {
        console.error(
          '[DismissalService] something went wrong while rehydrating',
          e
        );
      }
    });
  }
}
