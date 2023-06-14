import {
  Component,
  ChangeDetectorRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../services/api';
import { UpdateMarkersService } from '../../../../common/services/update-markers.service';
import { VideoChatService } from '../../../videochat/videochat.service';
import { timer, Subscription } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { SlowFadeAnimation } from '../../../../animations';
import { Session } from '../../../../services/session';

/**
 * Displays a few avatars of group members and a button that
 * goes to the full list of users
 */
@Component({
  selector: 'm-group--member-previews',
  templateUrl: 'member-previews.component.html',
  animations: [SlowFadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupMemberPreviews {
  readonly cdnUrl: string;
  @Input() group;
  members: Array<any> = [];

  // v2 only. Count of members to display on user aggregator
  membersCount: number = 3;

  count: Number = 0;
  totalCount: Number = 0;
  inProgress: boolean = false;
  gatheringParticipantTimer;

  /**
   * Whether this is being displayed in modern groups
   */
  @Input() v2: boolean = false;

  // Get guid in case we need to reroute
  private groupGuid: string;

  private updateMarkersSubscription: Subscription;
  private gatheringParticipantUpdateSubscription: Subscription;

  constructor(
    private client: Client,
    private updateMarkers: UpdateMarkersService,
    private router: Router,
    private route: ActivatedRoute,
    private session: Session,
    private cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['guid']) {
        this.groupGuid = params['guid'];
      }
    });

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
        { limit: 5 }
      );

      if (!response.members) {
        return false;
      }

      this.members = response.members;
      this.totalCount = response.total;

      if (this.v2) {
        if (this.session.getLoggedInUser()) {
          // Remove this user from the previews.
          // They already know if they're in the group.
          this.members = this.members.filter(member => {
            return member.guid !== this.session.getLoggedInUser().guid;
          });
        }
        // Make sure we only pass as many members
        // as we want to display in the userAggregator
        if (this.members.length > 0) {
          this.members = this.members.slice(0, this.membersCount);
        }
      }

      this.inProgress = false;
    } catch {
      this.inProgress = false;
    }

    this.detectChanges();

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
        this.detectChanges();
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
    this.detectChanges();
  }

  currentTimestamp() {
    return Date.now() / 1000;
  }

  /**
   * Navigate to members view on click
   * @param $event
   */
  onAggregatorClick($event): void {
    if (this.v2 && this.groupGuid) {
      this.router.navigate(['group', this.groupGuid, 'members']);
    }
  }

  /**
   * Run change detection.
   * @returns { void }
   */
  private detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
