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
import { FeaturesService } from '../../../../services/features.service';
import { PostMenuService } from '../post-menu.service';
import { BehaviorSubject } from 'rxjs';

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
  | 'download';

@Component({
  selector: 'm-postMenu--v2',
  templateUrl: 'menu.component.html',
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

  isOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public session: Session,
    private cd: ChangeDetectorRef,
    public featuresService: FeaturesService,
    public service: PostMenuService
  ) {}

  ngOnInit() {
    this.service.setEntity(this.entity);
    this.service.setEntityOwner(this.user);
  }

  shouldShowEdit(): boolean {
    if (this.mediaModal || this.entity.permaweb_id) {
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

    return (
      (this.options.indexOf('delete') !== -1 &&
        this.entity.owner_guid == this.session.getLoggedInUser().guid) ||
      this.session.isAdmin() ||
      this.canDelete
    );
  }

  shouldShowUndoRemind(): boolean {
    return (
      this.entity.type === 'activity' &&
      this.entity.remind_users &&
      this.entity.remind_users.filter(
        user => user.guid === this.session.getLoggedInUser().guid
      ).length > 0
    );
  }

  shouldShowDownload(): boolean {
    return this.options.indexOf('download') !== -1 && this.canDownload;
  }

  onButtonClick(e: MouseEvent): void {
    this.isOpened$.next(true);
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

    this.isOpened$.next(false);
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
}
