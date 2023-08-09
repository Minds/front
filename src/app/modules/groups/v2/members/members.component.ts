import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GroupMembershipLevel } from '../group.types';
import { MindsGroup } from '../group.model';
import { GroupService } from '../group.service';

/**
 * Container for the group members tab
 */
@Component({
  selector: 'm-group__members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.ng.scss'],
})
export class GroupMembersComponent {
  constructor(protected service: GroupService) {}

  // Allows us to use enum in template
  public groupMembershipLevel: typeof GroupMembershipLevel = GroupMembershipLevel;
}
