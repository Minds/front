import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SocketsService } from '../../services/sockets';
import { AbstractSubscriberComponent } from '../components/abstract-subscriber/abstract-subscriber.component';

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
export class EntityMetricsSocketService extends AbstractSubscriberComponent {
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

  /**
   * Constructor.
   * @param sockets - sockets service.
   */
  constructor(private sockets: SocketsService) {
    super();
  }

  /**
   * Setup subscriptions to listen for changes, and update instance member subjects accordingly.
   * @param { string } entityGuid
   * @returns { this }
   */
  public listen(entityGuid: string): this {
    this.subscriptions.push(
      this.sockets.onReady$.subscribe(() => {
        this.sockets.join(`entity:metrics:${entityGuid}`);
      }),
      this.sockets.subscribe(
        `entity:metrics:${entityGuid}`,
        (event: string) => {
          try {
            this.updateInstanceSubjects(JSON.parse(event));
          } catch (e) {
            console.error(e, event);
            return;
          }
        }
      )
    );
    return this;
  }

  /**
   * Leave room to stop listening for changes.
   * @param { string } entityGuid - guid to leave room for.
   * @returns { this }
   */
  public leave(entityGuid: string): this {
    this.sockets.leave(`entity:metrics:${entityGuid}`);
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
}
