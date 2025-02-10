import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';

import { Session } from '../../../services/session';
import { SocketsService } from '../../../services/sockets';
import { CommentsService } from '../comments.service';
import { BlockListService } from '../../../common/services/block-list.service';
import { ActivityService } from '../../../common/services/activity.service';
import { PermissionIntentsService } from '../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../graphql/generated.engine';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-comments__thread',
  templateUrl: 'thread.component.html',
  styleUrls: ['thread.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommentsService],
})
export class CommentsThreadComponent implements OnInit, AfterViewInit {
  @Input() parent;
  @Input() entity;
  @Input() entityGuid;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() readonly: boolean = false;
  @Input() conversation: boolean = false;
  @Input() limit: number = 12;
  @Input() level = 0;
  @Input() compact: boolean = false;
  @Input() showReplies: boolean = true;
  @Output() scrollToBottom: EventEmitter<boolean> = new EventEmitter(true);
  @Output() scrollToCurrentPosition: EventEmitter<boolean> = new EventEmitter(
    true
  );
  @Output() onHeightChange: EventEmitter<{
    oldHeight: number;
    newHeight: number;
  }> = new EventEmitter();
  @ViewChild('poster') poster;
  /** the height of the container of this component */
  threadHeight = 0;
  @Input() scrollable: boolean = false;
  @ViewChild('scrollArea', { static: true }) scrollView: ElementRef;
  commentsScrollEmitter: EventEmitter<any> = new EventEmitter();
  autoloadBlocked: boolean = false;

  comments: Array<any> = [];
  inProgress: boolean = false;
  error: string = '';

  loadNextToken: string;
  loadPreviousToken: string;
  moreNext: boolean = true;
  morePrevious: boolean = true;

  socketRoomName: string;
  socketSubscriptions: { comment: Subscription } = {
    comment: null,
  };
  direction: 'asc' | 'desc' = 'desc';

  /** Whether comment poster should be hidden. */
  protected shouldHideCommentPoster: boolean = false;

  constructor(
    public session: Session,
    private commentsService: CommentsService,
    public sockets: SocketsService,
    private renderer: Renderer2,
    protected blockListService: BlockListService,
    private cd: ChangeDetectorRef,
    public activityService: ActivityService,
    private permissionIntentsService: PermissionIntentsService
  ) {}

  ngOnInit() {
    if (this.level > 0) {
      this.direction = 'asc';
    }

    this.shouldHideCommentPoster = this.permissionIntentsService.shouldHide(
      PermissionsEnum.CanComment
    );
    this.load(true);

    // Listen to live comments
    this.listen();
  }

  ngOnDestroy() {
    this.socketSubscriptions.comment?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.threadHeight = this.scrollView?.nativeElement?.offsetHeight ?? 0;
  }

  get guid(): string {
    return this.entity.entity_guid ? this.entity.entity_guid : this.entity.guid;
  }

  async load(
    refresh: boolean = false,
    keepScrollPosition = false,
    additionalOpts?: any
  ) {
    if (refresh) {
      this.comments = [];

      // Reset live comments
      if (this.socketRoomName) {
        this.sockets.leave(this.socketRoomName);
      }
      this.socketRoomName = void 0;
    }

    this.inProgress = true;
    this.detectChanges();

    const descending: boolean =
      additionalOpts?.descending || this.direction === 'desc';
    const parent_path = this.parent.child_path || '0:0:0';

    let el = this.scrollView.nativeElement;

    let response: any = null;
    try {
      response = <{ comments; 'load-next'; 'load-previous'; socketRoomName }>(
        await this.commentsService.get({
          entity_guid: this.guid,
          parent_path,
          level: this.level,
          limit: 12,
          descending,
          ...additionalOpts,
        })
      );
    } catch (e) {}

    if (!response || !response.comments) {
      return;
    }

    // if it's the first time we load, update loadPreviousToken and loadNextToken
    if (this.comments.length === 0) {
      this.loadPreviousToken = response['load-previous'];
      this.loadNextToken = response['load-next'];
    } else if (descending && this.morePrevious) {
      this.loadPreviousToken = response['load-previous']; // if we're loading previous comments, then only update loadPreviousToken
    } else if (this.moreNext) {
      this.loadNextToken = response['load-next']; // if we're loading next comments, then only update loadNextToken
    }

    this.moreNext = !!this.loadNextToken;
    this.morePrevious = !!this.loadPreviousToken;

    const comments = response.comments;

    if (descending) {
      this.comments = comments.concat(this.comments);
    } else {
      this.comments = this.comments.concat(comments);
    }

    if (!this.socketRoomName && response.socketRoomName) {
      this.socketRoomName = response.socketRoomName;
      this.joinSocketRoom();
    }

    if (refresh && this.level === 0) {
      this.commentsScrollEmitter.emit('bottom');
    }

    if (keepScrollPosition) {
      this.detectChanges();
      this.onHeightChange.emit({
        oldHeight: this.threadHeight,
        newHeight: el.offsetHeight,
      });
    }

    this.inProgress = false;
    this.detectChanges();
    this.threadHeight = el.offsetHeight;
  }

  /**
   * Loads the next page
   */
  loadNext() {
    this.load(false, false, {
      // offset
      loadPrevious:
        this.direction === 'desc' ? this.loadPreviousToken : undefined,
      loadNext: this.direction === 'desc' ? undefined : this.loadNextToken,
    });
  }

  /**
   * Loads the previous page
   */
  loadPrevious() {
    this.load(false, true, {
      descending: this.direction === 'asc' ? 'desc' : 'asc',
      // token
      loadPrevious: this.loadPreviousToken,
    });
  }

  getComments() {
    if (this.direction === 'asc') {
      return this.comments;
    }

    return this.comments.slice().reverse();
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

    this.load(false);
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

    this.sockets.subscribe('reply', (guid) => {
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
    if (this.direction === 'asc') {
      this.comments.splice(i, 1);
    } else {
      this.comments.splice(this.comments.length - i - 1, 1);
    }

    this.detectChanges();
    return true;
  }

  edited(i, e) {
    // TODO
  }

  get isLoggedIn() {
    return this.session.isLoggedIn();
  }

  ngOnChanges(changes) {
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
