import { Injectable, OnDestroy } from '@angular/core';
import { time } from 'console';
import {
  combineLatest,
  interval,
  Observable,
  of,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import {
  combineAll,
  switchMap,
  take,
  tap,
  throttleTime,
  timeout,
} from 'rxjs/operators';
import { ApiService } from '../../api/api.service';

const UNREAD_CHECK_INTERVAL = 15000; // Check every 15 seconds

@Injectable({ providedIn: 'root' })
export class ChatIconService implements OnDestroy {
  /** Loading is in progress */
  inProgress = false;

  /** The subscription of the current poller */
  pollingSubscription: Subscription;

  /** The interval observable */
  interval$ = interval(UNREAD_CHECK_INTERVAL);

  /** The current unread count */
  private _unread$: Subject<number> = new Subject();

  /** Starts the polling and return the count */
  unread$: Observable<number> = of(0).pipe(
    tap(() => this.startPolling()),
    switchMap(() => this._unread$)
  );

  constructor(private api: ApiService) {}

  /**
   * Start polling for the total unread
   * @returns void
   */
  startPolling(): void {
    if (this.pollingSubscription) return;
    this.loadCount(); // Works better if we kick off (for window on focus events)
    this.pollingSubscription = this.interval$.subscribe(() => {
      this.loadCount();
    });
  }

  /**
   * Stops polling
   * @returns void
   */
  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  /**
   * Load the count
   */
  async loadCount(): Promise<void> {
    if (this.inProgress) return;
    this.inProgress = true;
    try {
      const response: any = await this.api
        .get('api/v3/matrix/total-unread')
        .toPromise();
      this._unread$.next(Number(response?.total_unread));
    } catch (err) {
    } finally {
      this.inProgress = false;
    }
  }

  /**
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
