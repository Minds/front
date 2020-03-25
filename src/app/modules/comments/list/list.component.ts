import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
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
import { ActivityService } from '../../../common/services/activity.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'minds-comments',
  inputs: [
    '_object : object',
    '_reversed : reversed',
    'limit',
    'focusOnInit',
    'scrollable',
  ],
  templateUrl: 'list.component.html',
  providers: [AttachmentService, ActivityService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent implements OnInit, OnDestroy {
  object;
  guid: string = '';
  parent: any;
  @Input() parentGuid = 0;
  @Input() focusedCommentGuid: string = '';
  comments: Array<any> = [];
  content = '';
  reversed: boolean = false;

  focusOnInit: boolean = false;
  scrollable: boolean = false;
  @ViewChild('message', { static: false }) textareaControl: Textarea;
  @ViewChild('scrollArea', { static: true }) scrollView: ElementRef;

  editing: boolean = false;

  showModal: boolean = false;

  limit: number = 12;
  earlierToken: string = '';
  laterToken: string = '';
  descendingInProgress: boolean = false;
  ascendingInProgress: boolean = false;
  canPost: boolean = true;
  triedToPost: boolean = false;
  moreDescendingData: boolean = false;
  moreAscendingData: boolean = false;
  loaded: boolean = false;

  socketRoomName: string;
  socketSubscriptions: any = {
    comment: null,
  };
  error: string;

  @Input() conversation: boolean = false;
  @Input() readonly: boolean = false;
  @Input() canEdit: boolean = false;

  commentsScrollEmitter: EventEmitter<any> = new EventEmitter();

  private autoloadBlocked = false;

  private overscrollTimer;
  private overscrollAmount = 0;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    private renderer: Renderer,
    private cd: ChangeDetectorRef,
    public activityService: ActivityService,
    private configs: ConfigsService
  ) {}

  set _object(value: any) {
    this.object = value;
    this.guid = this.object.guid;
    if (this.object.entity_guid) {
      this.guid = this.object.entity_guid;
    }
    this.parent = this.object;
  }

  set _reversed(value: boolean) {
    if (value) {
      this.reversed = true;
    } else {
      this.reversed = false;
    }
  }

  ngOnInit() {
    this.load(true, !this.focusedCommentGuid);
    this.listen();
  }

  load(refresh = false, descending = true) {
    if (refresh) {
      this.earlierToken = '';
      this.laterToken = '';
      this.moreDescendingData = descending || this.focusedCommentGuid !== '';
      this.moreAscendingData = !descending || this.focusedCommentGuid !== '';
      this.moreAscendingData = this.focusedCommentGuid !== '';
      this.comments = [];

      if (this.socketRoomName) {
        this.sockets.leave(this.socketRoomName);
      }
      this.socketRoomName = void 0;
    }

    if (
      (this.ascendingInProgress && !descending) ||
      (this.descendingInProgress && descending)
    ) {
      return;
    }

    this.error = '';
    if (descending) {
      this.descendingInProgress = true;
    } else {
      this.ascendingInProgress = true;
    }
    this.detectChanges();

    const parent_path = this.parent.child_path || '0:0:0';

    this.client
      .get(`api/v1/comments/${this.guid}/0/${parent_path}`, {
        limit: refresh ? 5 : this.limit,
        token: descending ? this.earlierToken : this.laterToken,
        offset: this.focusedCommentGuid || '',
        include_offset: !this.focusedCommentGuid == descending,
        descending: descending,
      })
      .then((response: any) => {
        if (!this.socketRoomName && response.socketRoomName) {
          this.socketRoomName = response.socketRoomName;
          this.joinSocketRoom();
        }

        this.loaded = true;
        if (descending) {
          this.descendingInProgress = false;
        } else {
          this.ascendingInProgress = false;
        }
        // this.moreDescendingData = true;

        if (!response.comments) {
          if (descending) {
            this.moreDescendingData = false;
          } else {
            this.moreAscendingData = false;
          }
          this.detectChanges();

          return false;
        }

        const el = this.scrollView.nativeElement;
        const previousScrollHeightMinusTop = el.scrollHeight - el.scrollTop;

        if (descending) {
          this.comments = response.comments.concat(this.comments);
        } else {
          this.comments = this.comments.concat(response.comments);
        }
        this.detectChanges();

        if (refresh) {
          this.commentsScrollEmitter.emit('bottom');
        }

        if (this.earlierToken && this.scrollView) {
          el.scrollTop = el.scrollHeight - previousScrollHeightMinusTop;

          this.detectChanges();
        }

        if (descending) {
          this.earlierToken = response['load-previous'];
          if (!this.earlierToken) {
            this.moreDescendingData = false;
          }
        } else {
          this.laterToken = response['load-previous'];
          if (!this.laterToken) {
            this.moreAscendingData = false;
          }
        }

        this.detectChanges();
      })
      .catch(e => {
        if (descending) {
          this.descendingInProgress = false;
        } else {
          this.ascendingInProgress = false;
        }
        this.error = (e && e.message) || 'There was an error';
        this.detectChanges();
      });
  }

  autoloadPrevious() {
    if (!this.moreDescendingData || this.autoloadBlocked) {
      return;
    }

    this.cancelOverscroll();

    this.autoloadBlocked = true;
    setTimeout(() => {
      this.autoloadBlocked = false;
    }, 1000);

    this.load(false, true);
  }

  overscrollHandler({ deltaY }) {
    this.cancelOverscroll();

    if (this.autoloadBlocked) {
      this.overscrollAmount = 0;
      return;
    }

    this.overscrollAmount += deltaY;

    this.overscrollTimer = setTimeout(() => {
      if (this.overscrollAmount < -75) {
        // 75px
        this.autoloadPrevious();
      }

      this.overscrollAmount = 0;
    }, 250); // in 250ms
  }

  cancelOverscroll() {
    if (this.overscrollTimer) {
      clearTimeout(this.overscrollTimer);
    }
  }

  joinSocketRoom() {
    if (this.socketRoomName) {
      this.sockets.join(this.socketRoomName);
    }
  }

  ngAfterViewInit() {
    if (this.focusOnInit && this.textareaControl) {
      this.textareaControl.focus();
    }
  }

  ngOnDestroy() {
    this.cancelOverscroll();

    if (this.socketRoomName && !this.conversation) {
      this.sockets.leave(this.socketRoomName);
    }

    for (let sub in this.socketSubscriptions) {
      if (this.socketSubscriptions[sub]) {
        this.socketSubscriptions[sub].unsubscribe();
      }
    }
  }

  listen() {
    this.socketSubscriptions.comment = this.sockets.subscribe(
      'comment',
      (entity_guid, owner_guid, guid) => {
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

        this.client
          .get(`api/v1/comments/${this.guid}/${guid}/${parent_path}`, {
            limit: 1,
            reversed: false,
            descending: true,
          })
          .then((response: any) => {
            if (!response.comments || response.comments.length === 0) {
              return;
            }

            // if the list is scrolled to the bottom
            const scrolledToBottom =
              this.scrollView.nativeElement.scrollTop +
                this.scrollView.nativeElement.clientHeight >=
              this.scrollView.nativeElement.scrollHeight;

            if (response.comments[0]._guid == guid) {
              this.comments.push(response.comments[0]);
            }

            this.detectChanges();

            if (scrolledToBottom) {
              this.commentsScrollEmitter.emit('bottom');
            }
          });
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
      const key = 'thumbs:' + direction + ':count';
      for (let i = 0; i < this.comments.length; i++) {
        if (this.comments[i]._guid == guid) {
          this.comments[i][key]++;
          this.detectChanges();
        }
      }
      // this.comments = this.comments.slice(0);
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

  postEnabled() {
    return (
      !this.descendingInProgress &&
      !this.ascendingInProgress &&
      this.canPost &&
      ((this.content && this.content.trim() !== '') || this.attachment.has())
    );
  }

  keypress(e: KeyboardEvent) {
    if (!e.shiftKey && e.charCode === 13) {
      this.post(e);
    }
  }

  async post(e) {
    e.preventDefault();

    if (!this.content && !this.attachment.has()) {
      return;
    }

    if (
      this.descendingInProgress ||
      this.ascendingInProgress ||
      !this.postEnabled()
    ) {
      this.triedToPost = true;
      this.detectChanges();

      return;
    }

    this.content = this.content.trim();

    const data = this.attachment.exportMeta();
    data['comment'] = this.content;
    data['parent_path'] = this.parent.child_path || '0:0:0';

    const newLength = this.comments.push({
        // Optimistic
        description: this.content,
        guid: 0,
        ownerObj: this.session.getLoggedInUser(),
        owner_guid: this.session.getLoggedInUser().guid,
        time_created: Date.now() / 1000,
        type: 'comment',
      }),
      currentIndex = newLength - 1;

    this.attachment.reset();
    this.content = '';

    this.detectChanges();

    this.commentsScrollEmitter.emit('bottom');

    try {
      const response: any = await this.client.post(
        'api/v1/comments/' + this.guid,
        data
      );
      this.comments[currentIndex] = response.comment;
    } catch (e) {
      this.comments[currentIndex].error =
        (e && e.message) || 'There was an error';
      console.error('Error posting', e);
    }

    this.detectChanges();

    this.commentsScrollEmitter.emit('bottom');
  }

  isLoggedIn() {
    if (!this.session.isLoggedIn()) {
      this.showModal = true;
      this.detectChanges();
    }
  }

  delete(index: number) {
    this.comments.splice(index, 1);
    this.object.replies_count -= 1;
    this.detectChanges();
  }

  edited(index: number, $event) {
    this.comments[index] = $event.comment;
  }

  resetPreview() {
    this.canPost = true;
    this.triedToPost = false;
    this.attachment.resetRich();
  }

  uploadAttachment(file: HTMLInputElement, e?: any) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment.setHidden(true);
    this.attachment.setContainer(this.object);
    this.attachment
      .upload(file)
      .then(guid => {
        this.canPost = true;
        this.triedToPost = false;
        file.value = null;
      })
      .catch(e => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
        file.value = null;
      });

    this.detectChanges();
  }

  removeAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment
      .remove()
      .then(() => {
        this.canPost = true;
        this.triedToPost = false;
        file.value = '';
      })
      .catch(e => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
      });

    this.detectChanges();
  }

  async getPostPreview(message) {
    if (!message) {
      return;
    }

    this.attachment.preview(message, this.detectChanges.bind(this));
  }

  reply(comment: any) {
    if (!comment || !comment.ownerObj) {
      return;
    }

    const username = comment.ownerObj.username;

    this.content = `@${username} ${this.content}`;
    this.detectChanges();

    setTimeout(() => {
      this.textareaControl.focus();
    }, 50);
  }

  getAvatar() {
    if (this.session.isLoggedIn()) {
      return `${this.configs.get('cdn_url')}icon/${
        this.session.getLoggedInUser().guid
      }/small/${this.session.getLoggedInUser().icontime}`;
    } else {
      return `${this.configs.get(
        'cdn_assets_url'
      )}assets/avatars/default-small.png`;
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes) {
    //  console.log('[comment:list]: on changes', changes);
  }
}
