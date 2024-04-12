import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';
import { PushNotificationService } from '../../../../common/services/push-notification.service';

/**
 * Banner for users to turn on web push notifications.
 */
@Component({
  selector: 'm-notifications__enablePushBanner',
  templateUrl: './enable-push-banner.component.html',
  styleUrls: ['./enable-push-banner.component.ng.scss'],
})
export class NotificationsEnablePushBannerComponent {
  // true when subscription attempt is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // true when push notifications are enabled.
  public readonly pushNotificationsEnabled$ = this.pushNotifications.enabled$;

  // true if push notifications are supported.
  public readonly pushNotificationsSupported$ =
    this.pushNotifications.supported$;

  constructor(
    private pushNotifications: PushNotificationService,
    private toast: ToasterService
  ) {}

  /**
   * Triggered on button click - attempts to register for web push
   * notifications by calling service. Handles errors and throws toasts.
   * @param { MouseEvent } $event - click event.
   * @returns { Promise<void> }
   */
  public async onButtonClick($event: MouseEvent): Promise<void> {
    this.inProgress$.next(true);

    try {
      await this.pushNotifications.requestSubscription();
      this.toast.success('Web push notifications enabled.');
    } catch (e) {
      console.error(e);
      switch (e?.name || e?.message) {
        case 'NotAllowedError':
          this.toast.error(
            'Your browser blocked Minds notifications. Change site settings in your browser to allow and try again.'
          );
          break;
        case 'timeout':
        default:
          this.toast.error('Something went wrong');
          break;
      }
    }

    this.inProgress$.next(false);
  }
}
