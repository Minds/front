import { Component, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Client } from '../../../../services/api';
import { UpdateMarkersService } from '../../../../common/services/update-markers.service';
import { VideoChatService } from '../../../videochat/videochat.service';
import { timer, Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';

@Component({
  selector: 'm-group--member-previews',
  templateUrl: 'member-previews.component.html',
})
export class GroupMemberPreviews {
  readonly cdnUrl: string;
  @Input() group;
  members: Array<any> = [];
  count: Number = 0;
  inProgress: boolean = false;
  gatheringParticipantTimer;

  private updateMarkersSubscription: Subscription;
  private gatheringParticipantUpdateSubscription: Subscription;

  constructor(
    private client: Client,
    private updateMarkers: UpdateMarkersService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    const checkIntervalSeconds = 2;
    this.gatheringParticipantTimer = timer(0, checkIntervalSeconds * 1000);
    this.load();
  }

  ngOnDestroy() {
    if (this.updateMarkersSubscription) {
      this.updateMarkersSubscription.unsubscribe();
    }

    if (this.gatheringParticipantUpdateSubscription) {
      this.gatheringParticipantUpdateSubscription.unsubscribe();
    }
  }

  async load() {
    this.inProgress = true;

    try {
      let response: any = await this.client.get(
        `api/v1/groups/membership/${this.group.guid}`,
        { limit: 12 }
      );

      if (!response.members) {
        return false;
      }

      this.members = response.members;

      if (response.total - this.members.length > 0) {
        this.count = response.total - this.members.length;
      }
      this.inProgress = false;
    } catch {
      this.inProgress = false;
    }

    this.updateMarkersSubscription = this.updateMarkers
      .getByEntityGuid(this.group.guid)
      .subscribe(
        (marker => {
          if (!marker) {
            return;
          }

          if (
            marker.entity_guid === this.group.guid &&
            marker.marker === 'gathering-heartbeat' &&
            marker.updated_timestamp > this.currentTimestamp() - 30
          ) {
            this.userIsInGathering(marker.user_guid);
          }
        }).bind(this)
      );

    this.gatheringParticipantUpdateSubscription = this.gatheringParticipantTimer.subscribe(
      () => this.updateGatheringParticipants()
    );
  }

  userIsInGathering(user_guid) {
    for (let member of this.members) {
      if (member.guid === user_guid) {
        member.inGathering = true;
        member.lastGatheringMarkerTimestamp = this.currentTimestamp();
      }
    }
  }

  updateGatheringParticipants() {
    const timestampThreshold =
      this.currentTimestamp() - 2 * VideoChatService.heartBeatIntervalSeconds;
    for (let member of this.members) {
      if (member.inGathering) {
        if (member.lastGatheringMarkerTimestamp < timestampThreshold) {
          member.inGathering = false;
        }
      }
    }
  }

  currentTimestamp() {
    return Date.now() / 1000;
  }
}
