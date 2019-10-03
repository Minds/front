import { Component, Input } from '@angular/core';
import { Client } from '../../../services/api';
import { FeaturesService } from '../../../services/features.service';
import { PermissionsService } from '../../../common/services/permissions/permissions.service';
import { Session } from '../../../services/session';
import { Flags } from '../../../common/services/permissions/flags';

@Component({
  selector: 'm-subscriptionsRequests__request',
  templateUrl: './request.component.html',
})
export class SubscriptionsRequestsRequestComponent {
  minds = window.Minds;
  @Input() request;

  get canApprove() {
    if (this.featuresService.has('permissions')) {
      return this.permissionsService.canInteract(
        this.session.getLoggedInUser(),
        Flags.APPROVE_SUBSCRIBER
      );
    }
  }

  get canDecline() {
    if (this.featuresService.has('permissions')) {
      return this.permissionsService.canInteract(
        this.session.getLoggedInUser(),
        Flags.APPROVE_SUBSCRIBER
      );
    }
  }

  constructor(
    private client: Client,
    private session: Session,
    private featuresService: FeaturesService,
    private permissionsService: PermissionsService
  ) {}

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
