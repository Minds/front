import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { map, switchAll, tap, throttleTime } from 'rxjs/operators';

/**
 * Trending service fetches and caches in memory the first 50 trending hashtags in Minds
 */
@Injectable()
export class TrendingService implements OnDestroy {
  /**
   * Tags observable subject
   */
  readonly tags$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  /**
   * Signal to trigger loads. Throttled to avoid multiple requests
   */
  readonly loadIntent$: Subject<void> = new Subject<void>();

  /**
   * Load intent subscription for clean up
   */
  readonly loadIntentSubscription: Subscription;

  /**
   * Constructor
   * @param api
   */
  constructor(protected api: ApiService) {
    // Setups intent pipe
    this.loadIntentSubscription = this.loadIntent$
      .pipe(
        throttleTime(5000),
        map(() => this.fetch()),
        switchAll(),
        tap((tags) => this.tags$.next(tags))
      )
      .subscribe(() => this.fetch());

    // Initial load
    this.load();
  }

  /**
   * Clean-up for component providers
   */
  ngOnDestroy(): void {
    this.loadIntentSubscription.unsubscribe();
  }

  /**
   * Trigger a load intent
   */
  async load() {
    this.loadIntent$.next();
  }

  /**
   * Fetch the set of trending hashtags and emit to subject
   */
  protected fetch(): Observable<string[]> {
    return this.api
      .get(`api/v2/hashtags/suggested`, {
        trending: 1,
        defaults: 0,
        limit: 50,
      })
      .pipe(
        map((response) =>
          response.tags
            .filter((tag) => tag.type === 'trending')
            .map((tag) => tag.value)
        )
      );
  }
}
