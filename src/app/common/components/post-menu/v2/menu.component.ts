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
  | 'disable-comments';

@Component({
  selector: 'm-postMenu--v2',
  templateUrl: 'menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PostMenuService],
})
export class PostMenuV2Component implements OnInit {
  @Input() entity: any;
  @Input() options: Array<Option>;
  @Output() optionSelected: EventEmitter<Option> = new EventEmitter<Option>();
  @Input() canDelete: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() isTranslatable: boolean = false;
  @Input() user: any;

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
    switch (option) {
      case 'edit':
        break;
      case 'share':
        this.service.openShareModal();
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
        await this.service.confirmDelete();
        break;
      case 'report':
        this.service.openReportModal();
        break;
    }

    this.optionSelected.emit(option);
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
