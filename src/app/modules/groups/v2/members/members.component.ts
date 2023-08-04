import { Component, Input, OnInit } from '@angular/core';
import { GroupMembershipLevel } from '../group.types';
import { MindsGroup } from '../group.model';
import { GroupMembersService } from './services/members.service';

/**
 * Container for the group members tab
 */
@Component({
  selector: 'm-group__members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.ng.scss'],
})
export class GroupMembersComponent implements OnInit {
  constructor(protected membersService: GroupMembersService) {}
  @Input() group: MindsGroup;

  // Allows us to use enum in template
  public groupMembershipLevel: typeof GroupMembershipLevel = GroupMembershipLevel;

  ngOnInit(): void {
    this.membersService.group$.next(this.group);
  }
}
