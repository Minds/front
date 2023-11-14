import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { Textarea } from '../../../common/components/editors/textarea.component';
import { SocketsService } from '../../../services/sockets';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { SignupModalService } from '../../modals/signup/service';
import { ConfigsService } from '../../../common/services/configs.service';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { Observable, Subscription } from 'rxjs';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { IsCommentingService } from './is-commenting.service';
import { Router } from '@angular/router';
import isMobile from '../../../helpers/is-mobile';
import moveCursorToEnd from '../../../helpers/move-cursor-to-end';
import { SupermindBannerPopupService } from '../../supermind/supermind-banner/supermind-banner-popup.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import {
  COMMENT_PERMISSIONS_ERROR_MESSAGE,
  PermissionsService,
} from '../../../common/services/permissions.service';
import { ToasterService } from '../../../common/services/toaster.service';

@Component({
  selector: 'm-comment__poster',
  templateUrl: 'poster.component.html',
  providers: [AttachmentService],
  styleUrls: ['poster.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentPosterComponent implements OnInit, OnDestroy {
  @Input() guid;
  @Input() entity;
  @Input() parent;
  @Input() readonly: boolean = false;
  @Input() currentIndex: number = -1;
  @Input() conversation: boolean = false;
  @Input() level: number = 0;
  @Output('optimisticPost') optimisticPost$: EventEmitter<
    any
  > = new EventEmitter();
  @Output('posted') posted$: EventEmitter<any> = new EventEmitter();

  @ViewChild('message')
  textArea: Textarea;

  content: string = '';
  triedToPost: boolean = false;
  comments: Array<any> = []; // TODO: remove this
  canPost: boolean = true;
  inProgress: boolean = false;
  maxLength: number = 1500;
  editing: boolean = false;
  caretOffset: number = 0;

  attachmentIntent: boolean = false; // whether user wants to attach file
  postIntent: boolean = false; // whether user wants to post the comment

  supermindBannerPopupSeen: boolean = false;

  commentConvertedToActivity: boolean = false;

  subscriptions: Subscription[] = [];
  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  constructor(
    public session: Session,
    public client: Client,
    private router: Router,
    private signupModal: SignupModalService,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    public suggestions: AutocompleteSuggestionsService,
    private renderer: Renderer2,
    private userAvatar: UserAvatarService,
    private cd: ChangeDetectorRef,
    private configs: ConfigsService,
    private authModal: AuthModalService,
    private isCommentingService: IsCommentingService,
    public elRef: ElementRef,
    public supermindBannerPopup: SupermindBannerPopupService,
    protected permissions: PermissionsService,
    protected toaster: ToasterService
  ) {}

  ngOnInit() {
    // Check this before we determine if it should be shown
    this.supermindBannerPopupSeen = this.supermindBannerPopup.hasBeenSeen();

    this.subscriptions.push(
      this.session.loggedinEmitter.subscribe(emitted => {
        this.detectChanges();
      }),
      this.supermindBannerPopup.visible$.subscribe(visible => {
        if (visible && this.canShowSupermindBannerPopup) {
          // Save if banner was seen so we don't show again
          this.supermindBannerPopup.setSeen();
        }
        this.detectChanges();
      }),
      this.supermindBannerPopup.supermindPosted$.subscribe(posted => {
        if (posted) {
          // Reset comment if it has been converted into a supermind
          this.commentConvertedToActivity = true;
          this.content = '';
          this.attachment.reset();

          this.detectChanges();
        }
      })
    );

    this.supermindBannerPopup.entity$.next(this.entity);
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Enable popup timer if experiment is enabled,
   * it hasn't been seen already this session
   * and this is a new top-level comment w/o attachments
   *
   */
  get canShowSupermindBannerPopup(): boolean {
    if (
      !this.supermindBannerPopup.experimentEnabled() ||
      this.supermindBannerPopupSeen
    ) {
      return false;
    }

    const isCommentingOnOwnEntity =
      this.session.getLoggedInUser().guid === this.entity.ownerObj.guid;

    return (
      this.level === 0 &&
      !this.editing &&
      !this.attachmentIntent &&
      !this.postIntent &&
      !this.commentConvertedToActivity &&
      !isCommentingOnOwnEntity
    );
  }

  keyup(e: KeyboardEvent) {
    this.getPostPreview(this.content);
    this.updateCaretPosition();
  }

  /**
   * Fires before keypress function, includes backspace event.
   * @param { KeyboardEvent } e - keyboard event.
   */
  keydown(e: KeyboardEvent) {
    // set is typing state for other components to hook into.
    this.isCommentingService.isCommenting$.next(this.content.trim().length > 1);

    this.supermindBannerPopup.startTimer();
  }

  keypress(e: KeyboardEvent) {
    if (!e.shiftKey && e.charCode === 13) {
      this.post(e);
    }
  }

  async post(e) {
    if (!this.postEnabled()) {
      console.error(COMMENT_PERMISSIONS_ERROR_MESSAGE);
      return;
    }
    e.preventDefault();

    // Don't try to show banner if comment is already posted
    this.postIntent = true;

    this.attachment.resetPreviewRequests();
    if (this.content.length > this.maxLength) {
      return;
    }

    if (this.inProgress) return;

    this.inProgress = true;

    if (!this.content && !this.attachment.has()) {
      this.inProgress = false;
      return;
    }

    this.content = this.content.trim();

    let data = this.attachment.exportMeta();
    data['comment'] = this.content;
    data['parent_path'] = this.parent.child_path || '0:0:0';
    data['client_meta'] = this.clientMeta.build({
      campaign: this.entity['urn'],
      medium: this.entity['boosted'] ? 'boost' : 'feed',
    });

    let comment = {
      // Optimistic
      description: this.content,
      guid: 0,
      ownerObj: this.session.getLoggedInUser(),
      owner_guid: this.session.getLoggedInUser().guid,
      time_created: Date.now() / 1000,
      type: 'comment',
      error: null,
    };

    this.optimisticPost$.next(comment);

    this.attachment.reset();
    this.isCommentingService.reset();
    this.content = '';

    this.detectChanges();

    try {
      let response: any = await this.client.post(
        'api/v1/comments/' + this.guid,
        data
      );
      this.posted$.next({
        comment: response.comment,
        index: this.currentIndex,
      });
    } catch (e) {
      comment.error = (e && e.message) || 'There was an error';
      this.posted$.next({ comment, index: this.currentIndex });
      console.error('Error posting', e);
    }
    this.inProgress = false;
    this.detectChanges();
  }

  resetPreview() {
    this.canPost = true;
    this.triedToPost = false;
    this.attachment.resetRich();
  }

  async uploadFile(fileInput: HTMLInputElement, event) {
    this.attachmentIntent = true;

    if (fileInput.value) {
      // this prevents IE from executing this code twice
      this.isCommentingService.isCommenting$.next(true);
      try {
        await this.uploadAttachment(fileInput);

        fileInput.value = null;
      } catch (e) {
        fileInput.value = null;
      }
    }
    this.detectChanges();
  }

  async uploadAttachment(file: HTMLInputElement | File) {
    this.attachmentIntent = true;

    this.canPost = false;
    this.triedToPost = false;

    this.attachment.setHidden(true);
    this.attachment.setContainer(this.entity);

    this.detectChanges();

    this.attachment
      .upload(file, this.detectChanges.bind(this))
      .then(guid => {
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
        this.detectChanges();
      })
      .catch(e => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
        this.detectChanges();
      });

    this.detectChanges();
  }

  removeAttachment(fileInput: HTMLInputElement) {
    this.attachmentIntent = false;

    this.canPost = false;
    this.triedToPost = false;

    this.attachment
      .remove()
      .then(() => {
        this.canPost = true;
        this.triedToPost = false;
        fileInput.value = null;
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

  /**
   * sets caret position
   */
  updateCaretPosition() {
    const element = this.textArea?.editorControl?.nativeElement;
    var caretOffset = 0;

    if (element && window.getSelection) {
      var range = window.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }

    this.caretOffset = caretOffset;
  }

  getAvatar(): Observable<string> {
    return this.userAvatar.src$;
  }

  postEnabled() {
    if (
      this.content.length > this.maxLength ||
      !this.permissions.canComment()
    ) {
      return false;
    }
    return true; // TODO: fix
  }

  get isLoggedIn() {
    return this.session.isLoggedIn();
  }

  async showLoginModal(): Promise<void> {
    const user = await this.authModal.open();
    if (user) {
      this.detectChanges();
    }
  }

  /**
   * Whether "Log in" to comment prompt should be shown.
   * @returns { boolean } true if prompt should be shown.
   */
  public shouldShowLoginPrompt(): boolean {
    return this.router.url !== '/';
  }

  onEmoji(emoji) {
    const preText = this.content.substring(0, this.caretOffset);
    const postText = this.content.substring(this.caretOffset);
    this.content = preText + emoji.native + postText;
    // move caret after emoji
    this.caretOffset += emoji.native.length;
  }

  isMobile() {
    return isMobile();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * focuses the input
   * @param { boolean } shouldMoveCursorToEnd should move cursor to end
   * @returns { void }
   */
  focus(shouldMoveCursorToEnd: boolean = true) {
    if (!this.permissions.canComment()) {
      return;
    }
    const el = this.textArea?.editorControl?.nativeElement;
    if (el) {
      el.focus({
        preventScroll: true,
      });
      if (shouldMoveCursorToEnd) {
        moveCursorToEnd(el);
      }
    }
  }

  protected checkPermissions($event): void {
    if (!this.permissions.canComment()) {
      this.toaster.error(COMMENT_PERMISSIONS_ERROR_MESSAGE);

      $event.preventDefault();
      $event.stopPropagation();
    }
  }
}
