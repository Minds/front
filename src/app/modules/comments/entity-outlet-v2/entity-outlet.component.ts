import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  HostBinding,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { SocketsService } from '../../../services/sockets';
import { CommentsService } from '../comments.service';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';
import { ActivityService } from '../../newsfeed/activity/activity.service';

@Component({
  selector: 'm-comments__entityOutletV2',
  templateUrl: 'entity-outlet.component.html',
  styleUrls: ['entity-outlet.component.ng.scss'],
  providers: [AttachmentService, CommentsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsEntityOutletV2Component {
  entity;
  guid: string = '';
  parent: any;

  @Input() limit: number = 12;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() fixedHeight = false;
  @Input() showOnlyToggle = false;
  @Input() compact = false;
  @Output() onHeightChange: EventEmitter<{
    oldHeight: number;
    newHeight: number;
  }> = new EventEmitter();
  optimisticList: Array<any> = [];

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public legacyActivityService: ActivityServiceCommentsLegacySupport,
    public activityService: ActivityService
  ) {}

  ngOnInit() {
    if (!this.activityService.displayOptions.isFeed) {
      this.openFullComments();
    }
  }

  @Input('entity')
  set _entity(value: any) {
    this.entity = value;
    this.guid = this.entity.guid;
    if (this.entity.entity_guid) this.guid = this.entity.entity_guid;
    this.parent = this.entity;
    if (!this.canDelete) {
      this.canDelete =
        this.entity.owner_guid == this.session.getLoggedInUser().guid;
    }
  }

  get count(): number {
    return this.entity['comments:count'] || 0;
  }

  onPosted({ comment, index }): void {
    if (this.fixedHeight) {
      this.redirectToSinglePage();
    }
    this.optimisticList[index] = comment;
    this.detectChanges();
  }

  onOptimisticPost(comment): void {
    if (this.fixedHeight) return;
    this.optimisticList.push(comment);
  }

  toggleComments(): void {
    if (this.count > 0) {
      if (this.showOnlyToggle) {
        this.openFullComments();
      } else {
        this.closeFullComments();
      }
    }
  }

  openFullComments(): void {
    if (this.fixedHeight) {
      // redirect to full view newsfeed post
      this.redirectToSinglePage();
    }
    this.showOnlyToggle = false;

    this.activityService.setDisplayOptions({
      showOnlyCommentsInput: false,
    });
    this.detectChanges();
  }

  closeFullComments(): void {
    this.showOnlyToggle = true;

    this.activityService.setDisplayOptions({
      showOnlyCommentsToggle: true,
    });
    this.detectChanges();
  }

  redirectToSinglePage(): void {
    this.router.navigate([`/newsfeed/${this.entity.guid}`], {
      queryParams: {
        fixedHeight: 0,
      },
    });
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes) {
    //  console.log('[comment:list]: on changes', changes);
  }

  /**
   * deletes an optimistic comment from the array
   * @param i index of the comment
   */
  delete(i: number) {
    this.optimisticList.splice(i, 1);
    this.detectChanges();
  }
}
