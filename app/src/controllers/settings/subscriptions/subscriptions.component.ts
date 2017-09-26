import { Component } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-settings-subscriptions',
  templateUrl: 'subscriptions.component.html'
})
export class SettingsSubscriptions {
  subscriptions: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  minds: any;

  constructor(private client: Client) {
    this.minds = window.Minds;
  }

  ngOnInit() {
    this.load(true);
  }

  load(refresh: boolean = false) {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.subscriptions = [];
    }

    this.client.get('api/v1/payments/subscriptions/exclusive', { offset: this.offset })
      .then((response: any) => {
        if (!response.subscriptions) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.subscriptions = this.subscriptions.concat(response.subscriptions);
        this.offset = response['load-next'];
        this.inProgress = false;

        if (!this.offset) {
          this.moreData = false;
        }
      })
      .catch(e => {
        this.inProgress = false;
        console.error(e);
      });
  }

  deleteRow(index) {
    this.subscriptions.splice(index, 1);
  }

}
