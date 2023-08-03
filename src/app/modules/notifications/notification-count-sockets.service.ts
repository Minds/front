import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SocketsService } from '../../services/sockets';

/**
 * Service that can be used to subscribe to entity metrics event changes
 * via sockets for a given entity guid. To use, be sure to call listen,
 * or you will not get any outputted values.
 */
@Injectable({ providedIn: 'root' })
export class NotificationCountSocketsService implements OnDestroy {
  /** Used within this class internally to set new values for notification count. */
  private readonly countSubject$: Subject<number> = new Subject<number>();

  /** Observable of notification count - debounced. */
  public readonly count$: Observable<number> = this.countSubject$.pipe(
    debounceTime(500)
  );

  /** names of currently joined rooms. */
  private joinedRooms: string[] = [];

  // subscriptions.
  private countSubscription: Subscription;
  private onReadySubscription: Subscription;

  constructor(private sockets: SocketsService) {}

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  /**
   * Setup subscriptions to listen for changes, and update instance member subjects accordingly.
   * @param { string } userGuid - guid of user to listen for changes for.
   * @returns { this }
   */
  public listen(userGuid: string): this {
    if (this.countSubscription || this.onReadySubscription) {
      console.info('Leaving all notification count rooms before re-listening.');
      this.leaveAll();
    }

    this.onReadySubscription = this.sockets.onReady$.subscribe(() => {
      const roomName: string = `notification:count:${userGuid}`;
      this.sockets.join(roomName);
      this.joinedRooms.push(roomName);
    });

    this.countSubscription = this.sockets.subscribe(
      `notification:count:${userGuid}`,
      (count: number): void => {
        this.countSubject$.next(count);
      }
    );
    return this;
  }

  /**
   * Leave all rooms, stop listening for changes and destroy subscriptions.
   * @returns { this }
   */
  public leaveAll(): this {
    for (const room of this.joinedRooms) {
      this.sockets.leave(room);
    }
    this.joinedRooms = [];
    this.destroySubscriptions();
    return this;
  }

  /**
   * Destroy class subscriptions.
   * @returns { this }
   */
  private destroySubscriptions(): this {
    if (this.countSubscription) {
      this.countSubscription.unsubscribe();
      this.countSubscription = null;
    }
    if (this.onReadySubscription) {
      this.onReadySubscription.unsubscribe();
      this.onReadySubscription = null;
    }
    return this;
  }
}
