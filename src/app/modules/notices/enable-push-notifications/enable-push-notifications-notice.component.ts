import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../common/services/form-toast.service';
import { FeedNoticeService } from '../feed-notice.service';

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
    private api: ApiService,
    private toast: FormToastService,
    private feedNotice: FeedNoticeService
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
      this.api
        .post('api/v3/notifications/push/settings/all', { enabled: true })
        .pipe(
          take(1),
          catchError(e => {
            console.error(e);
            return EMPTY;
          })
        )
        .subscribe(response => {
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
