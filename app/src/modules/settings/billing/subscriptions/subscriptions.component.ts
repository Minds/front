import { Component, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../../common/api/client.service';


@Component({
  selector: 'm-settings--billing-subscriptions',
  templateUrl: 'subscriptions.component.html'
})

export class SettingsBillingSubscriptionsComponent {

  minds = window.Minds;
  inProgress: boolean = false;
  subscriptions: Array<any> = [];

  constructor(private client: Client, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.loadList();
  }

  loadList(): Promise<any> {
    this.inProgress = true;
    this.subscriptions = [];
    this.cd.detectChanges();

    return this.client.get(`api/v1/payments/subscriptions`)
      .then(({ subscriptions }) => {
        this.inProgress = false;

        if (subscriptions && subscriptions.length) {
          this.subscriptions = subscriptions;
          this.detectChanges();
        }
      })
      .catch(e => {
        this.inProgress = false;
        this.detectChanges();
      });
  }

  cancel(i: number) {
    this.inProgress = true;
    this.cd.detectChanges();

    let subscription = this.subscriptions[i];
    this.client.delete(`api/v1/payments/subscriptions/${subscription.id}`)
      .then(() => {
        this.subscriptions.splice(i, 0);
        this.inProgress = false;
        this.cd.detectChanges();
      })
      .catch(e => {
        alert('Sorry, there was an error');
        this.inProgress = false;
        this.cd.detectChanges();
      });
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
