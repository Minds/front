import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'm-settings--subscriptions',
  templateUrl: 'subscriptions.component.html',
})
export class SettingsSubscriptionsComponent {
  readonly cdnUrl: string;
  subscriptions: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  constructor(private client: Client, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
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

    this.client
      .get('api/v1/payments/subscriptions/exclusive', { offset: this.offset })
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
