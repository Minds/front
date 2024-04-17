import {
  EventEmitter,
  Inject,
  Injectable,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Client } from '../../services/api';
import { SocketsService } from '../../services/sockets';
import { Session } from '../../services/session';
import { MetaService } from '../../common/services/meta.service';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { SiteService } from '../../common/services/site.service';
import { NotificationCountSocketsService } from './notification-count-sockets.service';

/**
 * Service handling the getting and updating
 * of notification counts using sockets
 */
@Injectable()
export class NotificationService implements OnDestroy {
  /** @deprecated - not in use. */
  public onReceive: EventEmitter<any> = new EventEmitter();

  /** Count of notifications */
  public count: number = 0;

  /** Observable count of notifications - used in V3 notifications */
  public count$: Subject<number> = new Subject<number>();

  // subscriptions.
  private notificationPollTimer: Observable<number>;
  private notificationCountSocketSubscription: Subscription;
  private notificationPollTimerSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public sockets: SocketsService,
    public metaService: MetaService,
    private notificationCountSockets: NotificationCountSocketsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    protected site: SiteService
  ) {}

  ngOnDestroy() {
    this.notificationPollTimerSubscription?.unsubscribe();
    this.notificationCountSocketSubscription?.unsubscribe();
  }

  /**
   * Listen to socket events for count updates.
   * @returns { void }
   */
  public listen(): void {
    if (
      !this.session.getLoggedInUser() ||
      !isPlatformBrowser(this.platformId)
    ) {
      return;
    }

    this.notificationCountSockets.listen(this.session.getLoggedInUser().guid);
    this.notificationCountSocketSubscription =
      this.notificationCountSockets.count$.subscribe((count: number): void => {
        this.count = count;
        this.syncCount();
      });
  }

  /**
   * Unlisten to all joined notification count rooms.
   * @returns { void }
   */
  public unlisten(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.notificationCountSockets.leaveAll();
      this.notificationCountSocketSubscription?.unsubscribe();
    }
  }

  /**
   * Fetch the notification count and sets up a
   * polling subscription to check for
   * future updates - else this is handled via sockets.
   * @returns { void }
   */
  public updateNotificationCount(): void {
    this.fetchNotificationCountFromServer(); // run once - rest of updates come through sockets.
  }

  /**
   * Increment the notifications count.
   * @param { number } incrementBy - number to increment by - defaults to 1.
   * @returns { void }
   */
  public incrementCount(incrementBy: number = 1): void {
    this.count = this.count + incrementBy;
    this.syncCount();
  }

  /**
   * Clear the notifications count.
   * @returns { void }
   */
  public clearCount(): void {
    this.count = 0;
    this.syncCount();
  }

  /**
   * Sync count of notifications to class state and meta service
   * for meta title counter.
   * @returns { void }
   */
  private syncCount(): void {
    this.count$.next(this.count);
    this.metaService.setCounter(this.count);
  }

  /**
   * Make a request for notification count from the server directly,
   * and update class state accordingly.
   * @returns { void }
   */
  private fetchNotificationCountFromServer(): void {
    if (!this.session.isLoggedIn()) {
      return;
    }

    this.client
      .get('api/v3/notifications/unread-count', {})
      .then((response: any) => {
        this.count = response.count;
        this.syncCount();
      });
  }
}
