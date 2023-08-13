import { Component } from '@angular/core';
import { GroupMembershipLevel } from '../group.types';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';

export type MembersViewListType = 'members' | 'moderators';
/**
 * Container for the group members tab
 */
@Component({
  selector: 'm-group__members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.ng.scss'],
})
export class GroupMembersComponent {
  syncMembersList: boolean = false;
  syncModeratorsList: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(protected service: GroupService) {}

  // Allows us to use enum in template
  public groupMembershipLevel: typeof GroupMembershipLevel = GroupMembershipLevel;

  // When one list changes, reload the other one
  protected syncList(type: MembersViewListType) {
    if (type === 'members') {
      this.syncMembersList = true;
    } else if (type === 'moderators') {
      this.syncModeratorsList = true;
    }

    this.refreshSyncStatus();
  }

  private refreshSyncStatus(): void {
    this.syncMembersList = false;
    this.syncModeratorsList = false;
  }
}
