import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SocketsService } from '../../services/sockets';

// Parsed metrics changed event.
type MetricsChangedEvent = {
  'thumbs:up:count'?: number;
  'thumbs:down:count'?: number;
};

/**
 * Service that can be used to subscribe to entity metrics event changes via sockets for a given
 * entity guid. To use, be sure to call listen, or you will not get any outputted values.
 */
@Injectable()
export class EntityMetricsSocketService implements OnDestroy {
  /** @type { BehaviorSubject<number> } - used within this instance to set new values for thumbs up count */
  private readonly thumbsUpCountSubject$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(null);

  /** @type { Observable<number> } - observable of thumbs up count changes - distinct until changed, and debounced */
  public readonly thumbsUpCount$: Observable<
    number
  > = this.thumbsUpCountSubject$.pipe(
    distinctUntilChanged(),
    debounceTime(500)
  );

  /** @type { BehaviorSubject<number> } - used within this instance to set new values for thumbs down count */
  private readonly thumbsDownCountSubject$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(null);

  /** @type { Observable<number> } - observable of thumbs down count changes - distinct until changed, and debounced */
  public readonly thumbsDownCount$: Observable<
    number
  > = this.thumbsDownCountSubject$.pipe(
    distinctUntilChanged(),
    debounceTime(500)
  );

  /** @type { boolean } isJoined - true if room is joined. */
  private isJoined = false;

  /** @type { Subscription } subscription to metric event changes */
  private metricsSubscription: Subscription;

  /** @type { Subscription } on sockets ready subscription */
  private onReadySubscription: Subscription;

  /**
   * Constructor.
   * @param sockets - sockets service.
   */
  constructor(private sockets: SocketsService) {}

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  /**
   * Setup subscriptions to listen for changes, and update instance member subjects accordingly.
   * @param { string } entityGuid
   * @returns { this }
   */
  public listen(entityGuid: string): this {
    if (this.metricsSubscription) {
      console.error('Already subscribed to entity metrics sockets');
      return;
    }

    if (!this.onReadySubscription) {
      this.onReadySubscription = this.sockets.onReady$.subscribe(() => {
        this.sockets.join(`entity:metrics:${entityGuid}`);
        this.isJoined = true;
      });
    }

    this.metricsSubscription = this.sockets.subscribe(
      `entity:metrics:${entityGuid}`,
      (event: string) => {
        try {
          this.updateInstanceSubjects(JSON.parse(event));
        } catch (e) {
          console.error(e, event);
          return;
        }
      }
    );
    return this;
  }

  /**
   * Leave room to stop listening for changes.
   * @param { string } entityGuid - guid to leave room for.
   * @returns { this }
   */
  public leave(entityGuid: string): this {
    if (this.isJoined) {
      this.sockets.leave(`entity:metrics:${entityGuid}`);
      this.isJoined = false;
    }
    this.destroySubscriptions();
    return this;
  }

  /**
   * Update instance subjects with values from sockets.
   * @param { MetricsChangedEvent } metricsEvent - Object containing updated metrics.
   * @returns { this }
   */
  private updateInstanceSubjects(metricsEvent: MetricsChangedEvent): this {
    if (!isNaN(metricsEvent['thumbs:up:count'])) {
      this.thumbsUpCountSubject$.next(metricsEvent['thumbs:up:count']);
    }
    if (!isNaN(metricsEvent['thumbs:down:count'])) {
      this.thumbsDownCountSubject$.next(metricsEvent['thumbs:down:count']);
    }
    return this;
  }

  /**
   * Destroy class subscriptions.
   * @returns { this }
   */
  private destroySubscriptions(): this {
    if (this.metricsSubscription) {
      this.metricsSubscription.unsubscribe();
      this.metricsSubscription = null;
    }
    if (this.onReadySubscription) {
      this.onReadySubscription.unsubscribe();
      this.onReadySubscription = null;
    }
    return this;
  }
}
