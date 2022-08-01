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
import { ApiResource } from '../../../common/api/api-resource.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';
import { ActivityService } from '../../newsfeed/activity/activity.service';

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

  inProgress: boolean = false;
  error: string = '';

  loadNextToken: string;
  loadPreviousToken: string;
  moreNext: boolean = true;
  morePrevious: boolean = true;

  socketRoomName: string;
  socketSubscriptions: any = {
    comment: null,
  };
  direction: 'asc' | 'desc' = 'desc';
  comments$ = new BehaviorSubject([]);

  constructor(
    public session: Session,
    private commentsService: CommentsService,
    public sockets: SocketsService,
    private renderer: Renderer2,
    protected blockListService: BlockListService,
    private cd: ChangeDetectorRef,
    public legacyActivityService: ActivityServiceCommentsLegacySupport,
    public activityService: ActivityService,
    private apiResource: ApiResource
  ) {}

  ngOnInit() {
    if (this.level > 0) {
      this.direction = 'asc';
    }

    this.load(true);
  }

  ngAfterViewInit(): void {
    this.threadHeight = this.scrollView?.nativeElement?.offsetHeight ?? 0;
  }

  get guid(): string {
    return this.entity.entity_guid ? this.entity.entity_guid : this.entity.guid;
  }

  commentsQuery = this.apiResource.query<any, any>('', {
    cachePolicy: ApiResource.CachePolicy.cacheFirst,
    cacheStorage: ApiResource.CacheStorage.Session,
  });

  async load(
    refresh: boolean = false,
    keepScrollPosition = false,
    additionalOpts?: any
  ) {
    if (refresh) {
      // Reset live comments
      if (this.socketRoomName) {
        this.sockets.leave(this.socketRoomName);
      }
      this.socketRoomName = void 0;
    }

    const descending: boolean =
      additionalOpts?.descending || this.direction === 'desc';
    const parent_path = this.parent.child_path || '0:0:0';

    const url = `api/v2/comments/${this.guid}/0/${parent_path}`;
    const params = {
      entity_guid: this.guid,
      parent_path,
      // level: this.level,
      limit: 12,
      desc: descending,
      include_offset: false,
      ...additionalOpts,
    };

    this.commentsQuery
      .setOptions({
        params,
        url,
        updateState: (newState, oldState) => {
          if (!newState) return; // TODO: be careful

          // TODO: this shouldn't be here, this is just for updateState
          if (!oldState && newState) {
            this.loadPreviousToken = newState['load-previous'];
            this.loadNextToken = newState['load-next'];
          } else if (newState) {
            if (descending && this.morePrevious) {
              this.loadPreviousToken = newState['load-previous']; // if we're loading previous comments, then only update loadPreviousToken
            } else if (this.moreNext) {
              this.loadNextToken = newState['load-next']; // if we're loading next comments, then only update loadNextToken
            }
          }

          let comments = [];

          let newComments = newState.comments;
          const oldComments = oldState?.comments || [];

          if (descending) {
            comments = oldComments.concat(newComments);
          } else {
            comments = newComments.concat(oldComments);
          }

          const state = {
            ...oldState,
            ...newState,
            comments,
          };

          return state;
        },
      })
      .fetch(params)
      .data$.pipe(
        tap(response => {
          if (!response) return;

          this.moreNext = !!this.loadNextToken;
          this.morePrevious = !!this.loadPreviousToken;

          if (!this.socketRoomName && response.socketRoomName) {
            this.socketRoomName = response.socketRoomName;
            this.joinSocketRoom();
          }
        })
      )
      .pipe(
        map(response => {
          if (this.direction === 'desc') {
            return (response?.comments || []).slice().reverse();
          }

          return response?.comments || [];
        })
      )
      .subscribe(this.comments$); // TODO: remove subscription

    if (refresh && this.level === 0) {
      this.commentsScrollEmitter.emit('bottom');
    }

    let el = this.scrollView.nativeElement;

    if (keepScrollPosition) {
      this.detectChanges();
      this.onHeightChange.emit({
        oldHeight: this.threadHeight,
        newHeight: el.offsetHeight,
      });
    }

    this.threadHeight = el.offsetHeight;
  }

  /**
   * Loads the next page
   */
  loadNext() {
    this.commentsQuery.fetchMore({
      // offset
      'load-previous':
        this.direction === 'desc' ? this.loadPreviousToken : undefined,
      'load-next': this.direction === 'desc' ? undefined : this.loadNextToken,
    });
  }

  /**
   * Loads the previous page
   */
  loadPrevious() {
    this.commentsQuery.fetchMore({
      descending: this.direction === 'asc' ? 'desc' : 'asc',
      // token
      loadPrevious: this.loadPreviousToken,
    });
  }

  get comments() {
    return this.comments$.getValue();
  }

  isThreadBlocked() {
    return this.comments.length > 0 && this.comments.length === 0;
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
            this.pushComment(comment);
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

  pushComment(comment) {
    // TODO: make this easier to use
    this.commentsQuery.setData(oldData => {
      return {
        ...oldData,
        comments: [...oldData.comments, comment],
      };
    });
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
    this.pushComment(comment);
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

  handleReplyExpanded(comment, expanded: boolean) {
    this.activityService.setDisplayOptions({
      expandedReplies: {
        ...this.activityService.displayOptions.expandedReplies,
        [comment.urn]: expanded,
      },
    });
  }
}
