import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushNotificationService } from '../../services/push-notification.service';
import { ToasterService } from '../../services/toaster.service';
import { TopbarAlertService } from '../topbar-alert/topbar-alert.service';

/** Banner key for dismissal and data-refs. */
export const PUSH_NOTIFICATION_BANNER_KEY: string = 'push-notification';

/**
 * Enable push notification banner.
 */
@Component({
  selector: 'm-topbarAlert__enablePushNotification',
  templateUrl: 'topbar-enable-push-notifications-banner.component.html',
  styleUrls: ['../topbar-alert/topbar-alert.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarEnablePushNotificationsBannerComponent {
  /** Banner key for dismissal and data-refs. */
  protected PUSH_NOTIFICATION_BANNER_KEY: string = PUSH_NOTIFICATION_BANNER_KEY;

  constructor(
    private pushNotificationService: PushNotificationService,
    private topbarAlertService: TopbarAlertService,
    private toaster: ToasterService
  ) {}

  /**
   * Handle enable notifications action click.
   * @returns { void }
   */
  protected async enableNotificationsClick(): Promise<void> {
    try {
      await this.pushNotificationService.requestSubscription();
      this.dismiss();
      this.toaster.success('Push notifications enabled');
    } catch (e) {
      console.error(e);

      switch (e?.name || e?.message) {
        case 'NotAllowedError':
          this.toaster.error('Permission denied');
          break;
        case 'timeout':
        default:
          this.toaster.error('Something went wrong');
          break;
      }
    }
  }

  /**
   * Handle dismiss click.
   * @returns { void }
   */
  protected dismiss(): void {
    this.topbarAlertService.dismiss(PUSH_NOTIFICATION_BANNER_KEY);
  }
}
