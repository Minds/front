import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { Router } from '@angular/router';
import { Session } from './../../../services/session';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { MindsGroup } from '../../../modules/groups/v2/group.model';
import {
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
  skip,
} from 'rxjs';
import { GroupMembershipService } from '../../services/group-membership.service';
import { ButtonColor, ButtonSize } from '../button/button.component';
import {
  ClientMetaData,
  ClientMetaService,
} from '../../services/client-meta.service';
import { ClientMetaDirective } from '../../directives/client-meta.directive';
import { ToasterService } from '../../services/toaster.service';

export type GroupMembershipButtonType =
  | 'join'
  | 'leave'
  | 'awaiting'
  | 'invited'
  | null;

export type GroupMembershipButtonLabelType =
  | 'verboseAction'
  | 'action'
  | 'pastTense';

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
    if (group) {
      this.service.setGroup(group);
    }
    this._group = group;
  }

  /**
   * Whether the button overlay styling should be applied
   * (only relevant when displayAsButton is true)
   */
  @Input()
  overlay: boolean = false;

  /**
   * If true, don't show any text on the buttons
   */
  @Input()
  iconOnly: boolean = false;

  /**
   * The icon to show when user has joined the group
   * (only relevant when iconOnly is true)
   */
  @Input() isMemberIcon = 'close';

  /**
   * Customize button size
   * (only relevant when displayAsButton is true)
   */
  @Input()
  size: ButtonSize = 'small';

  /**
   * Customize button color
   * (only customizable when displayAsButton is true)
   * If not customized, it will be 'blue' when the button says 'join' and grey otherwise
   */
  @Input()
  customColor: ButtonColor;

  /**
   * action - default. Buttons say "Join", "Leave", "Cancel Request", etc.
   * verboseAction - buttons say "Join Group" instead of "Join", "Leave Group" instead of "Leave".
   * pastTense - the buttons say what happened after you clicked "Join" (e.g. "Joined"/"Requested").
   */
  @Input()
  labelType: GroupMembershipButtonLabelType = 'action';

  /**
   * If false, display as a string of text instead of an outlined button
   * (see activity owner blocks for example)
   */
  @Input()
  displayAsButton: boolean = true;

  /** Whether to navigate to the group page after join action. */
  @Input() navigateOnJoin: boolean = false;

  @Output() onMembershipChange: EventEmitter<GroupMembershipChangeOuput> =
    new EventEmitter();

  subscriptions: Subscription[] = [];

  /** Whether a "join" click has already been recorded. */
  private joinClickRecorded: boolean = false;

  /**
   * Determine which button to show (if any)
   */
  public readonly buttonType$: Observable<GroupMembershipButtonType> =
    combineLatest([
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
      }),
      shareReplay()
    );

  constructor(
    public service: GroupMembershipService,
    public session: Session,
    private router: Router,
    private loginReferrer: LoginReferrerService,
    private clientMetaService: ClientMetaService,
    private toaster: ToasterService,
    @SkipSelf() @Optional() private parentClientMeta: ClientMetaDirective
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
      this.service.isMember$
        .pipe(skip(1), distinctUntilChanged())
        .subscribe((is) => {
          if (is) {
            this.recordClick();
          }
          this.onMembershipChange.emit({ isMember: is });
        })
    );
  }

  /**
   * Records a click on the group membership button.
   * @returns { void }
   */
  public recordClick(): void {
    if (this.joinClickRecorded) {
      return;
    }
    this.joinClickRecorded = true;

    const extraClientMetaData: Partial<ClientMetaData> = {};

    if (Boolean((this.group as any).boosted_guid)) {
      extraClientMetaData.campaign = this.group.urn;
    }

    this.clientMetaService.recordClick(
      this.group.guid,
      this.parentClientMeta,
      extraClientMetaData
    );
  }

  /**
   * Decide what the click should do, depending on button type
   *
   * Two buttons are displayed for 'invited' type: the primary one is 'acceptInvitation'
   */
  onPrimaryButtonClick($event) {
    if (this.service.inProgress$.getValue()) return;
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
   * @returns { Promise<void> }
   */
  public async join(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      let endpoint = `/group/${this.group.guid}?join=true`;
      this.loginReferrer.register(endpoint);
      this.router.navigate(['/login']);
      return;
    }

    this.service.join({ navigateOnSuccess: this.navigateOnJoin });
  }

  /**
   * Leave a group
   */
  public async leave() {
    if (this.service.isOwner$.getValue()) {
      this.toaster.error("You can't leave a group that you own");
      return;
    }
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

  get color(): ButtonColor {
    if (this.customColor) {
      return this.customColor;
    }
    if (this.buttonType === 'join') {
      return 'blue';
    } else {
      return 'grey';
    }
  }
}
