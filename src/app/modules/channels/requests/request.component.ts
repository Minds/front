import { Component, Input } from '@angular/core';
import { Client } from '../../../services/api';

@Component({
  selector: 'm-subscriptionsRequests__request',
  templateUrl: './request.component.html',
})
export class SubscriptionsRequestsRequestComponent {
  minds = window.Minds;
  @Input() request;

  constructor(private client: Client) {}

  async accept() {
    this.request.declined = false;
    this.request.completed = true;
    <any>(
      await this.client.put(
        `api/v2/subscriptions/incoming/${this.request.subscriber_guid}/accept`
      )
    );
  }

  async decline() {
    this.request.declined = true;
    this.request.completed = true;
    <any>(
      await this.client.put(
        `api/v2/subscriptions/incoming/${this.request.subscriber_guid}/decline`
      )
    );
  }
}
