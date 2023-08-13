import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GroupService } from '../group.service';
import { GroupMembershipLevel, GroupReviewView } from '../group.types';

/**
 * Container component for the group review tab
 */
@Component({
  selector: 'm-group__review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.ng.scss'],
})
export class GroupReviewComponent {
  // Allows us to use enum in template
  public groupMembershipLevel: typeof GroupMembershipLevel = GroupMembershipLevel;
  /**
   * Which review tab is active
   */
  readonly view$: BehaviorSubject<GroupReviewView> = new BehaviorSubject<
    GroupReviewView
  >('feed');

  constructor(protected service: GroupService) {}
}
