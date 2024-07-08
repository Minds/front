import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { GroupService } from '../group.service';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { GroupMembershipChangeOuput } from '../../../../common/components/group-membership-button/group-membership-button.component';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

/**
 * Toolbar at top of group banner, with options that change
 * depending on user context/permissions
 */
@Component({
  selector: 'm-group__actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'actions.component.html',
  styleUrls: ['actions.component.ng.scss'],
})
export class GroupActionsComponent {
  subscriptions: Subscription[];

  /** Whether chat button should be shown. */
  protected readonly shouldShowChatButton$: Observable<boolean> = combineLatest(
    [
      this.service.isCoversationDisabled$,
      this.service.isMember$,
      this.service.isOwner$,
    ]
  ).pipe(
    map(
      ([isCoversationDisabled, isMember, isOwner]: [
        boolean,
        boolean,
        boolean,
      ]): boolean => {
        if (
          isCoversationDisabled &&
          this.permissionIntentsService.shouldHide(
            PermissionsEnum.CanCreateChatRoom
          )
        ) {
          return false;
        }
        return (isMember && !isCoversationDisabled) || isOwner;
      }
    )
  );

  /**
   * Constructor
   * @param service
   */
  constructor(
    public service: GroupService,
    private permissionIntentsService: PermissionIntentsService,
    private injector: Injector
  ) {}

  /**
   * Fires when membership changes as result of
   * clicking the membership button
   */
  onMembershipChange($event: GroupMembershipChangeOuput): void {
    if ($event.isMember === this.service.isMember$.getValue()) {
      return;
    }
    this.service.isMember$.next($event.isMember);

    // Ensure the composer shows up on top of the feed on join
    const group = this.service.group$.getValue();
    group['is:member'] = $event.isMember;
    this.service.syncLegacyService(group);
  }
}
