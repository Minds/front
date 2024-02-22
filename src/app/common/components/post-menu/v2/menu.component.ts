import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { PostMenuService } from '../post-menu.service';
import { AdminSupersetLinkService } from '../../../services/admin-superset-link.service';
import { PermissionsService } from '../../../services/permissions.service';

type Option =
  | 'edit'
  | 'view'
  | 'pin'
  | 'translate'
  | 'share'
  | 'follow'
  | 'unfollow'
  | 'feature'
  | 'unfeature'
  | 'delete'
  | 'report'
  | 'set-explicit'
  | 'remove-explicit'
  | 'monetize'
  | 'unmonetize'
  | 'subscribe'
  | 'unsubscribe'
  | 'rating'
  | 'block'
  | 'unblock'
  | 'allow-comments'
  | 'disable-comments'
  | 'download'
  | 'boost'
  | 'view-federated';

@Component({
  selector: 'm-postMenu--v2',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PostMenuService],
})
export class PostMenuV2Component implements OnInit {
  @Input() entity: any;
  @Input() options: Array<Option>;
  @Input() mediaModal: boolean = false;
  @Output() optionSelected: EventEmitter<Option> = new EventEmitter<Option>();
  @Input() canDelete: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() canDownload: boolean = false;
  @Input() isTranslatable: boolean = false;
  @Input() user: any;
  @Input() icon: 'more_vert' | 'more_horiz' = 'more_vert';

  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    public service: PostMenuService,
    private adminSupersetLink: AdminSupersetLinkService,
    protected permissions: PermissionsService
  ) {}

  ngOnInit() {
    this.service.setEntity(this.entity);
    this.service.setEntityOwner(this.user);
  }

  // Only show boost in post menu for non-owners
  // b/c owners already see it as an icon in the toolbar
  shouldShowBoost(): boolean {
    return (
      this.options.indexOf('boost') !== -1 &&
      this.entity.owner_guid !== this.session.getLoggedInUser().guid
    );
  }

  shouldShowEdit(): boolean {
    if (
      this.mediaModal ||
      this.entity.permaweb_id ||
      !this.permissions.canCreatePost() ||
      this.entity?.site_membership // You cannot edit a site membership post
    ) {
      return false;
    }
    return (
      this.options.indexOf('edit') !== -1 &&
      this.entity.owner_guid == this.session.getLoggedInUser().guid
    );
  }

  shouldShowDelete(): boolean {
    if (this.mediaModal) {
      return false;
    }

    if (this.entity.remind_users && this.entity.remind_users.length) {
      return false; // Do not show the delete option here as users have become confused
    }

    if (this.options.indexOf('delete') === -1) {
      return false;
    }

    const isPostOwner =
      this.entity.owner_guid === this.session.getLoggedInUser().guid;

    const isSiteAdmin = this.session.isAdmin();

    return isPostOwner || isSiteAdmin || this.canDelete;
  }

  shouldShowUndoRemind(): boolean {
    return (
      this.entity.type === 'activity' &&
      this.entity.remind_users &&
      this.entity.remind_users.filter(
        user => user.guid === this.session.getLoggedInUser().guid
      ).length > 0 &&
      this.permissions.canInteract()
    );
  }

  shouldShowDownload(): boolean {
    return this.options.indexOf('download') !== -1 && this.canDownload;
  }

  onButtonClick(e: MouseEvent): void {
    this.service.fetchFollowing();
    this.service.fetchBlock();
  }

  /**
   * Router for all options
   * !! Only user await when you want to pause the interactions !!
   * @param option
   */
  async onSelectedOption(option: Option): Promise<void> {
    let actionCancelled = false;

    switch (option) {
      case 'edit':
        break;
      case 'share':
        this.service.openShareModal();
        break;
      case 'pin':
        await this.service.togglePinned();
        break;
      case 'translate':
        break;
      // Async options
      case 'subscribe':
        this.service.subscribe();
        break;
      case 'unsubscribe':
        this.service.unSubscribe();
        break;
      case 'follow':
        this.service.follow();
        break;
      case 'unfollow':
        this.service.unfollow();
        break;
      case 'block':
        this.service.block();
        break;
      case 'unblock':
        this.service.unBlock();
        break;
      case 'allow-comments':
        this.service.allowComments(true);
        break;
      case 'disable-comments':
        this.service.allowComments(false);
        break;
      case 'boost':
        this.service.openBoostModal();
        break;

      // Destructive options
      case 'delete':
        actionCancelled = !(await this.service.confirmDelete());
        break;
      case 'report':
        this.service.openReportModal();
        break;
    }

    if (!actionCancelled) {
      this.optionSelected.emit(option);
    }

    this.detectChanges();
  }

  onNSFWSelected(reasons: Array<{ label; value; selected }>) {
    const nsfw = reasons.map(reason => reason.value);
    this.service.setNsfw(nsfw);
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
  }

  /**
   * Get Superset URL for user overview.
   * @returns { string } URL pointing to Superset user overview page.
   */
  public getUserSupersetUrl(): string {
    return this.adminSupersetLink.getUserOverviewUrl(this.entity.ownerObj.guid);
  }
}
