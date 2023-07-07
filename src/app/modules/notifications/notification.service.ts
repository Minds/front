import {
  AfterViewInit,
  EventEmitter,
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Client } from '../../services/api';
import { SocketsService } from '../../services/sockets';
import { Session } from '../../services/session';
import { MetaService } from '../../common/services/meta.service';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { SiteService } from '../../common/services/site.service';

@Injectable()
export class NotificationService implements OnDestroy {
  socketSubscriptions: any = {
    notification: null,
  };
  onReceive: EventEmitter<any> = new EventEmitter();
  notificationPollTimer;
  count: number = 0;

  // used in V3 notifications
  public count$: Subject<number> = new Subject();

  private updateNotificationCountSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public sockets: SocketsService,
    public metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: Object,
    protected site: SiteService
  ) {
    if (!this.site.isProDomain) {
      this.listen();
    }
  }

  /**
   * Listen to socket events
   */
  listen() {
    this.socketSubscriptions.notification = this.sockets.subscribe(
      'notification',
      guid => {
        this.increment();

        this.client
          .get(`api/v1/notifications/single/${guid}`)
          .then((response: any) => {
            if (response.notification) {
              this.onReceive.next(response.notification);
            }
          });
      }
    );
  }

  /**
   * Increment the notifications counter
   */
  increment(notifications: number = 1) {
    this.count = this.count + notifications;
    this.sync();
  }

  /**
   * Clear the notifications. For notification controller
   */
  clear() {
    this.count = 0;
    this.sync();
  }

  /**
   * Return the notifications
   */
  getNotifications() {
    const pollIntervalSeconds = 60;
    if (isPlatformBrowser(this.platformId)) {
      this.notificationPollTimer = timer(0, pollIntervalSeconds * 1000);
      this.updateNotificationCountSubscription = this.notificationPollTimer.subscribe(
        () => this.updateNotificationCount()
      );
    }
  }

  updateNotificationCount() {
    if (!this.session.isLoggedIn()) {
      return;
    }

    this.client
      .get('api/v3/notifications/unread-count', {})
      .then((response: any) => {
        this.count = response.count;
        this.sync();
      });
  }

  /**
   * Sync Notifications to the topbar Counter
   */
  sync() {
    this.count$.next(this.count);
    this.metaService.setCounter(this.count);
  }

  ngOnDestroy() {
    if (this.updateNotificationCountSubscription)
      this.updateNotificationCountSubscription.unsubscribe();
  }
}
