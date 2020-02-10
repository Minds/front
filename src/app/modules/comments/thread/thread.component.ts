import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { Upload } from '../../../services/api/upload';
import { AttachmentService } from '../../../services/attachment';
import { Textarea } from '../../../common/components/editors/textarea.component';
import { SocketsService } from '../../../services/sockets';
import { CommentsService } from '../comments.service';
import { BlockListService } from '../../../common/services/block-list.service';
import { ActivityService } from '../../../common/services/activity.service';
import { Subscription } from 'rxjs';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'm-comments__thread',
  templateUrl: 'thread.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommentsService],
})
export class CommentsThreadComponent implements OnInit {
  @Input() parent;
  @Input() entity;
  @Input() entityGuid;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() readonly: boolean = false;
  @Input() conversation: boolean = false;
  @Input() limit: number = 12;
  @Input() level = 0;
  @Output() scrollToBottom: EventEmitter<boolean> = new EventEmitter(true);
  @Output() scrollToCurrentPosition: EventEmitter<boolean> = new EventEmitter(
    true
  );

  @Input() scrollable: boolean = false;
  @ViewChild('scrollArea', { static: true }) scrollView: ElementRef;
  commentsScrollEmitter: EventEmitter<any> = new EventEmitter();
  autoloadBlocked: boolean = false;

  comments: Array<any> = [];
  blockedUsers: string[] = [];
  inProgress: boolean = false;
  error: string = '';

  loadNext: string;
  loadPrevious: string;
  moreNext: boolean = true;
  morePrevious: boolean = true;

  socketRoomName: string;
  socketSubscriptions: any = {
    comment: null,
  };

  constructor(
    public session: Session,
    private commentsService: CommentsService,
    public sockets: SocketsService,
    private renderer: Renderer,
    protected blockListService: BlockListService,
    private cd: ChangeDetectorRef,
    public activityService: ActivityService
  ) {}

  ngOnInit() {
    this.load(true);
    this.listen();
  }

  get guid(): string {
    return this.entity.entity_guid ? this.entity.entity_guid : this.entity.guid;
  }

  async load(refresh: boolean = false, direction: string = 'desc') {
    if (refresh) {
      this.comments = [];

      // Reset live comments
      if (this.socketRoomName) {
        this.sockets.leave(this.socketRoomName);
      }
      this.socketRoomName = void 0;

      await this.loadBlockedUsers();
    }

    this.inProgress = true;
    this.detectChanges();

    const descending: boolean = direction === 'desc';
    const parent_path = this.parent.child_path || '0:0:0';

    let el = this.scrollView.nativeElement;
    const previousScrollHeightMinusTop = el.scrollHeight - el.scrollTop;

    let response: any = null;
    try {
      response = <{ comments; 'load-next'; 'load-previous'; socketRoomName }>(
        await this.commentsService.get({
          entity_guid: this.guid,
          parent_path,
          level: this.level,
          limit: 12,
          loadNext: descending ? null : this.loadNext,
          loadPrevious: descending ? this.loadPrevious : null,
          descending,
        })
      );
    } catch (e) {}

    if (!response || !response.comments) {
      return;
    }

    let comments = response.comments;

    if (descending) {
      this.comments = comments.concat(this.comments);
    } else {
      this.comments = this.comments.concat(comments);
    }

    if (this.moreNext) this.loadNext = response['load-next'];
    if (this.morePrevious) this.loadPrevious = response['load-previous'];

    this.moreNext = !!this.loadNext;
    this.morePrevious = !!this.loadPrevious;

    if (!this.socketRoomName && response.socketRoomName) {
      this.socketRoomName = response.socketRoomName;
      this.joinSocketRoom();
    }

    if (refresh && this.level === 0) {
      this.commentsScrollEmitter.emit('bottom');
    } else if (this.scrollView && this.scrollable) {
      this.detectChanges();
      el.scrollTop = el.scrollHeight - previousScrollHeightMinusTop;
      console.log(el.scrollTop);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async loadBlockedUsers() {
    try {
      this.blockedUsers = (await this.blockListService.getList()) || [];
    } catch (e) {
      console.warn('CommentsThreadComponent.loadBlockedUsers', e);
    }

    return true;
  }

  isOwnerBlocked(comment) {
    return comment && this.blockedUsers.indexOf(comment.owner_guid) > -1;
  }

  getComments() {
    return this.comments.filter(comment => !this.isOwnerBlocked(comment));
  }

  isThreadBlocked() {
    return this.comments.length > 0 && this.getComments().length === 0;
  }

  autoloadPrevious() {
    if (!this.morePrevious || this.autoloadBlocked) {
      return;
    }

    this.autoloadBlocked = true;
    setTimeout(() => {
      this.autoloadBlocked = false;
    }, 1000);

    this.load(false, 'desc');
  }

  listen() {
    this.socketSubscriptions.comment = this.sockets.subscribe(
      'comment',
      async (entity_guid, owner_guid, guid) => {
        if (entity_guid !== this.guid) {
          return;
        }

        if (
          this.session.isLoggedIn() &&
          owner_guid === this.session.getLoggedInUser().guid
        ) {
          return;
        }

        const parent_path = this.parent.child_path || '0:0:0';

        const scrolledToBottom =
          this.scrollView.nativeElement.scrollTop +
            this.scrollView.nativeElement.clientHeight >=
          this.scrollView.nativeElement.scrollHeight;

        try {
          let comment: any = await this.commentsService.single({
            entity_guid: this.guid,
            guid: guid,
            parent_path: parent_path,
          });

          // if the list is scrolled to the bottom
          let scrolledToBottom =
            this.scrollView.nativeElement.scrollTop +
              this.scrollView.nativeElement.clientHeight >=
            this.scrollView.nativeElement.scrollHeight;

          if (comment) {
            await this.loadBlockedUsers();
            this.comments.push(comment);
          }

          this.detectChanges();

          if (scrolledToBottom) {
            this.commentsScrollEmitter.emit('bottom');
            this.scrollToBottom.next(true);
          }
        } catch (err) {}
      }
    );

    this.sockets.subscribe('reply', guid => {
      for (let i = 0; i < this.comments.length; i++) {
        if (this.comments[i]._guid == guid) {
          this.comments[i].replies_count++;
          this.detectChanges();
        }
      }
    });

    this.sockets.subscribe('vote', (guid, owner_guid, direction) => {
      if (
        this.session.isLoggedIn() &&
        owner_guid === this.session.getLoggedInUser().guid
      ) {
        return;
      }
      let key = 'thumbs:' + direction + ':count';
      for (let i = 0; i < this.comments.length; i++) {
        if (this.comments[i]._guid == guid) {
          this.comments[i][key]++;
          this.detectChanges();
        }
      }
      //this.comments = this.comments.slice(0);
      this.detectChanges();
    });

    this.sockets.subscribe('vote:cancel', (guid, owner_guid, direction) => {
      if (
        this.session.isLoggedIn() &&
        owner_guid === this.session.getLoggedInUser().guid
      ) {
        return;
      }
      let key = 'thumbs:' + direction + ':count';
      for (let i = 0; i < this.comments.length; i++) {
        if (this.comments[i]._guid == guid) {
          this.comments[i][key]--;
          this.detectChanges();
        }
      }
    });
  }

  joinSocketRoom() {
    if (this.socketRoomName) {
      this.sockets.join(this.socketRoomName);
    }
  }

  /**
   * Retries connection to sockets manually.
   */
  retry() {
    this.inProgress = true;
    this.listen();
    setTimeout(() => {
      this.inProgress = false;
    }, 2000);
  }

  onOptimisticPost(comment) {
    this.comments.push(comment);
    this.detectChanges();
    this.commentsScrollEmitter.emit('bottom');
    this.scrollToBottom.next(true);
  }

  onPosted({ comment, index }) {
    this.comments[index] = comment;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Removed the comment from the thread at the specified index.
   * @input {int} index of comment.
   */
  delete(i) {
    this.comments.splice(i, 1);
    this.comments[i].replies_count--;
    this.detectChanges();
    return true;
  }

  get isLoggedIn() {
    return this.session.isLoggedIn();
  }

  ngOnChanges(changes) {
    // console.log('[comment:thread]: on changes', changes);

    // reload on entity change.
    if (
      changes.entity &&
      changes.entity.previousValue &&
      changes.entity.previousValue.guid !== changes.entity.currentValue.guid
    ) {
      this.load(true);
    }
  }
}
