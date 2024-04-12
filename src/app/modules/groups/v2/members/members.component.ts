import { Component } from '@angular/core';
import { GroupMembershipLevel } from '../group.types';
import { GroupService } from '../group.service';
import { BehaviorSubject } from 'rxjs';

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
  syncMembersList: any = null;
  syncModeratorsList: any = null;

  membersListChanged$: BehaviorSubject<any> = new BehaviorSubject(null);

  moderatorsListChanged$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(protected service: GroupService) {}

  // Allows us to use enum in template
  public groupMembershipLevel: typeof GroupMembershipLevel =
    GroupMembershipLevel;
}
