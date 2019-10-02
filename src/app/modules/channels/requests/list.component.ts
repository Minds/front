import { Component } from '@angular/core';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-subscriptionsRequests__list',
  templateUrl: './list.component.html',
})
export class SubscriptionsRequestsListComponent {
  minds = window.Minds;
  requests: Array<any> = [];

  constructor(private client: Client) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    const { requests } = <any>(
      await this.client.get(`api/v2/subscriptions/incoming`)
    );
    this.requests = requests;
  }
}
