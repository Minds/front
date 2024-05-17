import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../services/session';
import { NotificationService } from './notification.service';
import isMobileOrTablet from '../../helpers/is-mobile-or-tablet';
import { Subscription, pairwise } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NOTIFICATION_SOUNDS_STORAGE_KEY } from '../settings-v2/account/notifications-v3/push-notifications/push-notifications.component';
import { Storage } from '../../services/storage';

/**
 * Topbar notification bell toggle.
 */
@Component({
  selector: 'm-notifications--topbar-toggle',
  templateUrl: 'toggle.component.html',
  styleUrls: ['toggle.component.ng.scss'],
})
export class NotificationsTopbarToggleComponent implements OnInit, OnDestroy {
  toggled: boolean = false;
  @ViewChild('notificationsFlyout') flyout: any;

  subscriptions: Subscription[] = [];

  private soundTimeout: any;
  private soundTimeoutElapsed: boolean = false;
  private notificationSound = new Audio(
    '../../../assets/audio/notification.wav'
  );

  constructor(
    public session: Session,
    public service: NotificationService,
    private router: Router,
    private storage: Storage,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only allow notification sounds after 10secs
      this.soundTimeout = setTimeout(() => {
        this.soundTimeoutElapsed = true;
      }, 10000);
    }

    // Play notification sound when count increases
    this.subscriptions.push(
      this.service.count$
        .pipe(pairwise())
        .subscribe(([previousCount, currentCount]) => {
          if (currentCount > previousCount) {
            this.playNotificationSound();
          }
        })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    if (this.soundTimeout) {
      clearTimeout(this.soundTimeout);
    }
  }
  /**
   * Toggle notification flyout or navigate to fullscreen notifications for mobile.
   * @param { unknown } e - event.
   * @returns { void }
   */
  toggle(e: unknown): void {
    if (isMobileOrTablet()) {
      this.router.navigate(['/notifications/v3']);
      return;
    }
    this.toggled = !this.toggled;
    if (this.toggled) {
      this.flyout.toggleLoad();
    }
  }

  /**
   * Play sound as long as user hasn't disabled sounds
   * and 10 secs have elapsed since load
   */
  private playNotificationSound(): void {
    const fromStorage = this.storage.get(NOTIFICATION_SOUNDS_STORAGE_KEY);
    const soundEnabled =
      fromStorage === 'true' || fromStorage === null ? true : false;

    if (this.soundTimeoutElapsed && soundEnabled) {
      this.notificationSound.play();
    }
  }
}
