import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { NotificationsSettingsV2Service } from '../../../settings-v2/account/notifications-v3/notifications-settings-v3.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Enable push notifications notice.
 */
@Component({
  selector: 'm-feedNotice--enablePushNotifications',
  templateUrl: 'enable-push-notifications-notice.component.html',
})
export class EnablePushNotificationsNoticeComponent extends AbstractSubscriberComponent {
  constructor(
    private router: Router,
    private toast: FormToastService,
    private feedNotice: FeedNoticeService,
    private notificationSettings: NotificationsSettingsV2Service
  ) {
    super();
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    this.subscriptions.push(
      this.notificationSettings.togglePush('all', true).subscribe(response => {
        if (response.enabled) {
          this.toast.success('Enabled push notifications');
          this.dismiss();
          return;
        }
        this.toast.error('Unable to save push notification settings');
      })
    );
  }

  /**
   * Called on secondary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onSecondaryOptionClick($event: MouseEvent): void {
    this.router.navigate(['/settings/account/push-notifications']);
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.setDismissed('enable-push-notifications', true);
  }
}
