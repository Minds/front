import { Component, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../../common/api/client.service';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Settings page for managing a list of recurring payments
 * made to other Minds channels
 */
@Component({
  selector: 'm-settingsV2__recurringPayments',
  templateUrl: './recurring-payments.component.html',
})
export class SettingsV2RecurringPaymentsComponent {
  init: boolean = false;
  inProgress: boolean = false;
  subscriptions: Array<any> = [];

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    protected toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.loadList();
  }

  loadList(): Promise<any> {
    this.inProgress = true;
    this.subscriptions = [];
    this.cd.detectChanges();

    return this.client
      .get(`api/v1/payments/subscriptions`)
      .then(({ subscriptions }) => {
        this.inProgress = false;

        if (subscriptions && subscriptions.length) {
          this.subscriptions = subscriptions;
        }
        this.init = true;
        this.detectChanges();
      })
      .catch((e) => {
        this.inProgress = false;
        this.init = true;
        this.detectChanges();
      });
  }

  cancel(i: number) {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    let subscription = this.subscriptions[i];
    subscription._cancelling = true;
    this.inProgress = true;
    this.cd.detectChanges();

    this.client
      .delete(`api/v1/payments/subscriptions/${subscription.id}`)
      .then(() => {
        this.subscriptions.splice(i, 1);
        subscription._cancelling = false;
        this.inProgress = false;
        this.cd.detectChanges();
      })
      .catch((e) => {
        this.toasterService.error('Sorry, there was an error');
        subscription._cancelling = false;
        this.inProgress = false;
        this.cd.detectChanges();
      });
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
