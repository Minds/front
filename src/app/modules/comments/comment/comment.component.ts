import { CommentPosterComponent } from './../poster/poster.component';
import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
  forwardRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  Inject,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Injector,
  HostListener,
  SkipSelf,
  Optional,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Session } from '../../../services/session';
import { Upload } from '../../../services/api/upload';
import { Client } from '../../../services/api/client';
import { AttachmentService } from '../../../services/attachment';
import { TranslationService } from '../../../services/translation';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { TimeDiffService } from '../../../services/timediff.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityService } from '../../../common/services/activity.service';
import { Router } from '@angular/router';
import isMobile from '../../../helpers/is-mobile';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { ModalService } from '../../../services/ux/modal.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ActivityModalCreatorService } from '../../newsfeed/activity/modal/modal-creator.service';
import { ShareModalComponent } from '../../modals/share/share';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { PermissionsService } from '../../../common/services/permissions.service';
import { NsfwEnabledService } from '../../multi-tenant-network/services/nsfw-enabled.service';
import {
  PermissionsEnum,
  SetCommentPinnedStateGQL,
  SetCommentPinnedStateMutation,
} from '../../../../graphql/generated.engine';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { ModerationActionGqlService } from '../../admin/moderation/services/moderation-action-gql.service';
import { PermissionIntentsService } from '../../../common/services/permission-intents.service';
import { MutationResult } from 'apollo-angular';

@Component({
  selector: 'm-comment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  outputs: ['_delete: delete', '_saved: saved'],
  host: {
    '(keydown.esc)': 'editing = false',
  },
  templateUrl: 'comment.component.html',
  styleUrls: ['comment.component.ng.scss'],
  providers: [AttachmentService],
})
export class CommentComponentV2 implements OnChanges, OnInit, AfterViewInit {
  comment: any;
  editing: boolean = false;
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;
  content: string = '';

  @Input('entity') entity;
  @Input('parent') parent;
  @Input('level') level = 0;
  // Whether comment should open in modal on `openModal` call.
  @Input('shouldOpenModal') shouldOpenModal: boolean = true;

  // Whether this comment is being shown as a notification
  @Input() isNotificationPreview: boolean = false;

  canPost: boolean = true;
  triedToPost: boolean = false;
  inProgress: boolean = false;
  error: string = '';
  @Input() showReplies: boolean = false;
  changesDetected: boolean = false;
  showMature: boolean = false;

  _delete: EventEmitter<any> = new EventEmitter();
  _saved: EventEmitter<any> = new EventEmitter();

  reportToggle: boolean = false;

  translation = {
    translated: false,
    target: '',
    error: false,
    description: '',
    source: null,
  };
  isTranslatable: boolean;
  translationInProgress: boolean;
  translateToggle: boolean = false;
  commentAge$: Observable<number>;

  canReply = true;
  videoDimensions: Array<any> = null;
  @ViewChild('batchImage') batchImage: ElementRef;

  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() hideToolbar: boolean = false;

  /** Whether menu button should be hidden. */
  @Input() hideMenuButton: boolean = false;

  @Input() poster: CommentPosterComponent;

  @Output() onReply = new EventEmitter();

  @Output() onHeightChange: EventEmitter<{
    oldHeight: number;
    newHeight: number;
  }> = new EventEmitter();

  // Compact view may be determined by input or window width
  // and is not used by activity V2
  _compact: boolean = false;

  commentAgeOnLoadMs: number;

  @Input() set compact(value: boolean) {
    // TODO this is always going to be false b/c
    // compact design was retired with activity v2
    // so we can remove it from comment, tree, thread, entity outlet
    this._compact = false;
    return;
  }

  /** Whether the user should have vote buttons hidden. */
  protected shouldHideVoteButtons: boolean = false;

  /** Whether reply button should be hidden. */
  protected shouldHideReplyButton: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public translationService: TranslationService,
    public userAvatar: UserAvatarService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef,
    private timeDiffService: TimeDiffService,
    private el: ElementRef,
    private router: Router,
    protected activityService: ActivityService,
    @Inject(PLATFORM_ID) private platformId: Object,
    configs: ConfigsService,
    protected toasterService: ToasterService,
    private activityModalCreator: ActivityModalCreatorService,
    private injector: Injector,
    public suggestions: AutocompleteSuggestionsService,
    private clientMetaService: ClientMetaService,
    protected permissions: PermissionsService,
    protected permissionIntentsService: PermissionIntentsService,
    protected nsfwEnabledService: NsfwEnabledService,
    private moderationActionsGql: ModerationActionGqlService,
    private setCommentPinnedStateGql: SetCommentPinnedStateGQL,
    @SkipSelf() @Optional() private parentClientMeta: ClientMetaDirective,
    @Inject(IS_TENANT_NETWORK) private isTenantNetwork: boolean
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.commentAge$ = this.timeDiffService.source.pipe(
        map((secondsElapsed) => {
          return this.comment.time_created - secondsElapsed;
        })
      );
    }

    this.commentAgeOnLoadMs = Date.now() - this.comment.time_created * 1000;

    if (this.isOwner) {
      this.showMature = true;
    }

    this.shouldHideReplyButton = this.permissionIntentsService.shouldHide(
      PermissionsEnum.CanComment
    );
    this.shouldHideVoteButtons = this.permissionIntentsService.shouldHide(
      PermissionsEnum.CanInteract
    );
    this.onResize();
  }

  ngAfterViewInit() {
    // scroll to focused comment.
    if (this.comment.focused) {
      // offset to give some padding to the scroll position.
      const headerOffset = 100;
      const elementPosition = this.el.nativeElement.getBoundingClientRect().top;

      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  }

  @Input('comment')
  set _comment(value: any) {
    if (!value) {
      return;
    }
    this.comment = value;
    this.attachment.load(this.comment);
    this.content = this.comment.description;

    this.isTranslatable = this.translationService.isTranslatable(this.comment);
  }

  set _editing(value: boolean) {
    this.editing = value;
  }

  /**
   * Whether the comment can be pinned.
   * @returns { boolean } true if the comment can be pinned.
   */
  get canPin(): boolean {
    return (
      this.level === 0 &&
      this.entity.ownerObj.guid === this.session.getLoggedInUser()?.guid
    );
  }

  @HostListener('window:resize')
  onResize() {
    this._compact = false;
    return;
  }

  canSave() {
    return (
      !this.inProgress &&
      this.canPost &&
      ((this.comment.description && this.comment.description.trim() !== '') ||
        this.attachment.has()) &&
      this.permissions.canComment()
    );
  }

  keypress(e: KeyboardEvent) {
    if (!e.shiftKey && e.charCode === 13) {
      e.preventDefault();
      this.applyAndSave(e);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      this.cancel(e);
    }
  }

  save() {
    this.comment.description = this.content.trim();

    if (!this.comment.description && !this.attachment.has()) {
      return;
    }

    const data = this.attachment.exportMeta();
    data['comment'] = this.comment.description;

    this.editing = false;
    this.inProgress = true;
    this.client
      .post('api/v1/comments/update/' + this.comment.guid, data)
      .then((response: any) => {
        this.inProgress = false;
        if (response.comment) {
          this._saved.next({
            comment: response.comment,
          });
          this.comment = response.comment;
        }
        this.comment.edited = true;
      })
      .catch((e) => {
        this.toasterService.error(
          e.message || 'An unknown error has occurred saving your comment.'
        );
        this.inProgress = false;
      });
  }

  applyAndSave(e) {
    if (!this.canSave()) {
      this.triedToPost = true;
      return;
    }

    this.comment.description = this.content;
    this.save();
  }

  cancel(e) {
    if (this.inProgress) {
      return;
    }

    this.editing = false;
    this.content = this.comment.description;
  }

  /**
   * Delete the comment.
   * @returns { Promise<void> }
   */
  async delete(): Promise<void> {
    if (!confirm("Do you want to delete this comment?\n\nThere's no UNDO.")) {
      return;
    }

    try {
      if (!this.isTenantNetwork || this.isOwner) {
        await this.client.delete('api/v1/comments/' + this.comment.guid);
      } else {
        await this.moderationActionsGql.deleteEntity(this.comment.urn);
      }
    } catch (e) {
      this.toasterService.error(e.message);
      console.error(e);
      return;
    }

    if (this.parent.type === 'comment') {
      this.parent.replies_count -= 1;
    }
    this._delete.next(true);
  }

  async uploadFile(fileInput: HTMLInputElement, event) {
    if (fileInput.value) {
      // this prevents IE from executing this code twice
      try {
        await this.uploadAttachment(fileInput);

        fileInput.value = null;
      } catch (e) {
        fileInput.value = null;
      }
    }
  }

  uploadAttachment(file: HTMLInputElement | File) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment
      .upload(file)
      .then((guid) => {
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
      })
      .catch((e) => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
      });
  }

  removeAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment
      .remove()
      .then(() => {
        this.canPost = true;
        this.triedToPost = false;

        // reset fields indicating that an attachment is present.
        this.comment.attachment = null;
        this.comment.perma_url = '';
        this.comment.title = '';
        this.comment.custom_type = null;

        if (file && file.value) {
          file.value = '';
        }
      })
      .catch((e) => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
      });
  }

  getPostPreview(message) {
    if (!message.value) {
      return;
    }

    this.attachment.preview(message.value);
  }

  resetPreview() {
    this.canPost = true;
    this.triedToPost = false;
    this.attachment.resetRich();
  }

  translate($event: any = {}) {
    if (!$event.selected) {
      return;
    }

    if (!this.translationService.isTranslatable(this.comment)) {
      return;
    }

    this.translation.target = '';
    this.translationService
      .getLanguageName($event.selected)
      .then((name) => (this.translation.target = name));

    this.translationInProgress = true;

    this.translationService
      .translate(this.comment.guid, $event.selected)
      .then((translation: any) => {
        this.translationInProgress = false;
        this.translation.source = null;

        for (let field in translation) {
          this.translation.translated = true;
          this.translation[field] = translation[field].content;

          if (this.translation.source === null && translation[field].source) {
            this.translation.source = '';
            this.translationService
              .getLanguageName(translation[field].source)
              .then((name) => (this.translation.source = name));
          }
        }
      })
      .catch((e) => {
        this.translationInProgress = false;
        this.translation.error = true;

        console.error('translate()', e);
      });
  }

  hideTranslation() {
    if (!this.translation.translated) {
      return;
    }

    this.translation.translated = false;
  }

  showReport() {
    this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: this.comment,
      },
    });
  }

  /**
   * Toggles showReplies - or in the event this is a level 2 comment
   * append target username to comment poster.
   * @returns { void }
   */
  public toggleReplies(): void {
    if (this.level === 2 && this.poster) {
      const targetTag = `@${this.comment.ownerObj.username}`;

      const posterEl = this.poster?.elRef?.nativeElement;
      if (posterEl) {
        // set input content
        if (this.poster.content.indexOf(targetTag) === -1) {
          this.poster.content = `${targetTag} ${this.poster.content}`;
          this.poster.detectChanges();
        }
        // scroll poster into view and stick it to the bottom (with 10vh offset)
        posterEl?.scrollIntoView?.({
          behavior: 'smooth',
          block: 'end',
        });

        // focus the input
        this.poster?.focus();
      }
      return;
    }
    this.showReplies = !this.showReplies;
  }

  toggleExplicit(e: MouseEvent): void {
    this.attachment.toggleMature();
  }

  /**
   * True if mature content should be shown
   * Does NOT check whether comment IS mature.
   * @returns { boolean } - true if mature comment and content should be shown.
   */
  shouldShowMatureContent(): boolean {
    return this.showMature || this.attachment.isForcefullyShown(this.comment);
  }

  ngOnChanges(changes) {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngDoCheck() {
    this.changesDetected = false;
    if (this.comment.error != this.error) {
      this.error = this.comment.error;
      if (Boolean(this.error)) {
        this.toasterService.error(this.error);
      }
      this.changesDetected = true;
    }

    if (this.changesDetected) {
      this.cd.detectChanges();
    }
  }

  // * ATTACHMENT MEDIA MODAL  * ---------------------------------------------------------------------

  setVideoDimensions($event) {
    this.videoDimensions = $event.dimensions;
    this.comment.custom_data.dimensions = this.videoDimensions;
  }

  setImageDimensions() {
    const img: HTMLImageElement = this.batchImage.nativeElement;
    this.comment.custom_data[0].width = img.naturalWidth;
    this.comment.custom_data[0].height = img.naturalHeight;
  }

  clickedImage() {
    const isNotTablet = Math.min(screen.width, screen.height) < 768;
    const pageUrl = `/media/${this.comment.entity_guid}`;

    if (isMobile() && isNotTablet) {
      this.router.navigate([pageUrl]);
      return;
    }

    if (
      this.comment.custom_data[0].width === '0' ||
      this.comment.custom_data[0].height === '0'
    ) {
      this.setImageDimensions();
    }
    this.openModal();
  }

  /**
   * Opens comment in an activity creator modal. The modal can trigger a redirect
   * in some scenarios.
   * @returns { void }
   */
  openModal(): void {
    if (this.shouldOpenModal) {
      this.activityModalCreator.create(this.comment, this.injector);
    }
  }

  /**
   * Whether delete option should be available.
   * @returns { boolean } true if delete option should be available.
   */
  showDelete(): boolean {
    const loggedInUserGuid = this.session.getLoggedInUser()?.guid;

    return (
      this.session.isAdmin() ||
      this.permissions.has(PermissionsEnum.CanModerateContent) ||
      this.canDelete ||
      this.comment.owner_guid == loggedInUserGuid ||
      this.entity.owner_guid == loggedInUserGuid ||
      this.parent.owner_guid == loggedInUserGuid
    );
  }
  // * ATTACHMENT MEDIA MODAL  * ---------------------------------------------------------------------

  //
  /**
   * Toggles mature visibility.
   */
  toggleMatureVisibility() {
    this.showMature = !this.showMature;

    this.comment.mature_visibility = !this.comment.mature_visibility;
  }

  public getAvatarSrc(): Observable<string> {
    if (this.comment.ownerObj.guid === this.session.getLoggedInUser().guid) {
      return this.userAvatar.src$;
    }
    return of(
      `${this.cdnUrl}icon/${this.comment.ownerObj.guid}/small/${this.comment.ownerObj.icontime}`
    );
  }

  get isOwner(): boolean {
    return this.session.getLoggedInUser().guid === this.comment.ownerObj.guid;
  }

  // Very new comments (less than 10s old) should be expanded for owner by default
  get disableReadMore(): boolean {
    return this.isOwner && this.commentAgeOnLoadMs < 10000;
  }

  /**
   * Toggle share modal
   */
  async openShareModal(): Promise<void> {
    return this.modalService.present(ShareModalComponent, {
      data: {
        url: this.entity.url,
        commentUrn: this.comment.urn,
      },
      modalDialogClass: 'm-overlayModal__share',
    }).result;
  }

  /**
   * Fires on output text click. We do this because we need to listen to link clicks
   * on anchor tags injected into the body via innerHTML, which strips any listeners
   * off the anchor tag at the time of injection. Instead we listen to all clicks on
   * any part of the output event, and filter out events on anchor tags to derive
   * when an anchor tag has been clicked.
   * @param { MouseEvent } $event - mouse event.
   * @returns { void }
   */
  public onDescriptionTextClick($event: MouseEvent): void {
    if (!this.parentClientMeta) {
      console.error('No parent client meta set');
      return;
    }
    if (($event.target as HTMLElement).tagName === 'A') {
      this.clientMetaService.recordClick(
        this.comment.guid,
        this.parentClientMeta
      );
    }
  }

  /**
   * Changes the pinned state of the comment.
   * @param { boolean } pinned - The new pinned state.
   * @returns { Promise<void> }
   */
  public async changePinnedState(pinned: boolean): Promise<void> {
    this.comment.pinned = pinned; // Optimistic update.

    try {
      const response: MutationResult<SetCommentPinnedStateMutation> =
        await firstValueFrom(
          this.setCommentPinnedStateGql.mutate({
            commentGuid: this.comment.guid,
            pinned,
          })
        );

      if (!response?.data?.commentPinnedState) {
        throw new Error('Failed to change pinned state');
      }

      this.toasterService.success(
        `Comment successfully ${pinned ? 'pinned' : 'unpinned'}`
      );
    } catch (error) {
      this.comment.pinned = !pinned; // revert the change.
      this.toasterService.error('Failed to change pinned state');
      console.error(error);
    }
  }
}
