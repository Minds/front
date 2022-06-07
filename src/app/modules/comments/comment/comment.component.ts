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
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Session } from '../../../services/session';
import { Upload } from '../../../services/api/upload';
import { Client } from '../../../services/api/client';
import { AttachmentService } from '../../../services/attachment';
import { TranslationService } from '../../../services/translation';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { TimeDiffService } from '../../../services/timediff.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityService } from '../../../common/services/activity.service';
import { Router } from '@angular/router';
import { FeaturesService } from '../../../services/features.service';
import isMobile from '../../../helpers/is-mobile';
import { ConfigsService } from '../../../common/services/configs.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { ActivityModalCreatorService } from '../../newsfeed/activity/modal/modal-creator.service';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { ModalService } from '../../../services/ux/modal.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';

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

  @Input() poster: CommentPosterComponent;

  @Output() onReply = new EventEmitter();

  @Output() onHeightChange: EventEmitter<{
    oldHeight: number;
    newHeight: number;
  }> = new EventEmitter();

  menuOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  posterMenuOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Compact view may be determined by input or window width
  // and is not used by activity V2
  _compact: boolean = false;

  commentAgeOnLoadMs: number;

  @Input() set compact(value: boolean) {
    if (this.activityV2Feature) {
      this._compact = false;
      return;
    } else {
      this._compact = value;
    }

    if (!value) {
      this.onResize();
    }
  }

  activityV2Feature: boolean = false;

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
    protected featuresService: FeaturesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    configs: ConfigsService,
    protected toasterService: FormToastService,
    private activityModalCreator: ActivityModalCreatorService,
    private injector: Injector,
    public suggestions: AutocompleteSuggestionsService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.commentAge$ = this.timeDiffService.source.pipe(
        map(secondsElapsed => {
          return this.comment.time_created - secondsElapsed;
        })
      );
    }

    this.activityV2Feature = this.activityV2Experiment.isActive();

    this.commentAgeOnLoadMs = Date.now() - this.comment.time_created * 1000;

    if (this.isOwner) {
      this.showMature = true;
    }

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

  @HostListener('window:resize')
  onResize() {
    if (this.activityV2Experiment.isActive()) {
      this._compact = false;
      return;
    }
    if (window.innerWidth <= 480) {
      this._compact = true;
    }
  }

  canSave() {
    return (
      !this.inProgress &&
      this.canPost &&
      ((this.comment.description && this.comment.description.trim() !== '') ||
        this.attachment.has())
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
      .catch(e => {
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

  delete() {
    if (!confirm("Do you want to delete this comment?\n\nThere's no UNDO.")) {
      return;
    }

    this.client.delete('api/v1/comments/' + this.comment.guid);
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
      .then(guid => {
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
      })
      .catch(e => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
      });

    this.posterMenuOpened$.next(false);
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
      .catch(e => {
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
      .then(name => (this.translation.target = name));

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
              .then(name => (this.translation.source = name));
          }
        }
      })
      .catch(e => {
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

  onMenuClick(e: MouseEvent): void {
    this.menuOpened$.next(true);
  }

  onPosterMenuClick(e: MouseEvent): void {
    this.posterMenuOpened$.next(true);
  }

  toggleExplicit(e: MouseEvent): void {
    this.attachment.toggleMature();
    this.posterMenuOpened$.next(false);
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
      this.toasterService.error(this.error);
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

  openModal() {
    this.activityModalCreator.create(this.comment, this.injector);
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
}
