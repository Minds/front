import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

import { Session } from './../../../services/session';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { MindsGroup } from '../../../modules/groups/v2/group.model';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { GroupMembershipService } from '../../services/group-membership.service';
import { ModernGroupsExperimentService } from '../../../modules/experiments/sub-services/modern-groups-experiment.service';
import { ButtonColor, ButtonSize } from '../button/button.component';

export type GroupMembershipButtonType =
  | 'join'
  | 'leave'
  | 'awaiting'
  | 'invited'
  | null;

export type GroupMembershipChangeOuput = { isMember: boolean };

/**
 * Click this button to join/leave a group,
 * accept/decline a group invitation (2 buttons are displayed),
 * or cancel a request to join a group.
 * (function changes depending on context)
 */
@Component({
  selector: 'm-group__membershipButton',
  templateUrl: './group-membership-button.component.html',
  styleUrls: ['./group-membership-button.component.ng.scss'],
  providers: [GroupMembershipService],
})
export class GroupMembershipButtonComponent implements OnDestroy {
  buttonType: GroupMembershipButtonType = null;

  private _group: MindsGroup;
  get group(): MindsGroup {
    return this._group;
  }
  @Input() set group(group: MindsGroup) {
    this._group = group;
    if (group) {
      this.service.setGroup(group);
    }
  }

  /**
   * Whether the button overlay styling should be applied
   */
  @Input()
  overlay: boolean = false;

  /**
   * If true, don't show any text on the buttons
   */
  @Input()
  iconOnly: boolean = false;

  /**
   * Customize button size
   */
  @Input()
  buttonSize: ButtonSize = 'small';

  /**
   * Customize button color
   */
  @Input()
  color: ButtonColor = 'grey';

  /**
   * If true, show "Join Group" instead of "Join", "Leave Group" instead of "Leave"
   */
  @Input()
  verbose: boolean = false;

  /**
   * The icon to show when user has joined the group
   * (only relevant when iconOnly is true)
   */
  @Input() isMemberIcon = 'close';

  @Output() onMembershipChange: EventEmitter<
    GroupMembershipChangeOuput
  > = new EventEmitter();

  subscriptions: Subscription[] = [];

  /**
   * Determine which button to show (if any)
   */
  public readonly buttonType$: Observable<
    GroupMembershipButtonType
  > = combineLatest([
    this.service.isMember$,
    this.service.isAwaiting$,
    this.service.isInvited$,
    this.service.isBanned$,
  ]).pipe(
    map(([isMember, isAwaiting, isInvited, isBanned]) => {
      if (!isMember && !isAwaiting && !isInvited && !isBanned) {
        this.buttonType = 'join';
      } else if (isMember) {
        this.buttonType = 'leave';
      } else if (isInvited) {
        this.buttonType = 'invited';
      } else if (isAwaiting) {
        this.buttonType = 'awaiting';
      } else {
        this.buttonType = null;
      }

      this.initIsMemberSubscription();

      return this.buttonType;
    })
  );

  constructor(
    public service: GroupMembershipService,
    public session: Session,
    private router: Router,
    private loginReferrer: LoginReferrerService,
    private modernGroupsExperiment: ModernGroupsExperimentService
  ) {}

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }

  /**
   * Watch for changes in isMember$ and emit to parent components when it changes
   */
  initIsMemberSubscription(): void {
    this.subscriptions.push(
      this.service.isMember$.subscribe(is => {
        this.onMembershipChange.emit({ isMember: is });
      })
    );
  }

  /**
   * Decide what the click should do, depending on button type
   *
   * Two buttons are displayed for 'invited' type: the primary one is 'acceptInvitation'
   */
  onPrimaryButtonClick($event) {
    switch (this.buttonType) {
      case 'join':
        this.join();
        break;
      case 'leave':
        this.leave();
        break;
      case 'awaiting':
        this.cancelRequest();
        break;
      case 'invited':
        this.acceptInvitation();
    }
  }

  /**
   * Join a group.
   * @param { MouseEvent } - mouse event.
   * @returns { void }
   */
  public async join(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      let endpoint = this.modernGroupsExperiment.isActive()
        ? `/group/${this.group.guid}?join=true`
        : `/groups/profile/${this.group.guid}/feed?join=true`;

      this.loginReferrer.register(endpoint);
      this.router.navigate(['/login']);
      return;
    }

    this.service.join();
  }

  /**
   * Leave a group
   */
  public async leave() {
    this.service.leave();
  }

  /**
   * Accept an invitation to join a group
   */
  public async acceptInvitation() {
    this.service.acceptInvitation();
  }

  /**
   * Decline an invitation to join a group
   */
  public async declineInvitation() {
    this.service.declineInvitation();
  }

  /**
   * Cancel a group join request
   */
  public async cancelRequest() {
    this.service.cancelRequest();
  }
}
