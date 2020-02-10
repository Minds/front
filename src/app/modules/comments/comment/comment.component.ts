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
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Session } from '../../../services/session';
import { Upload } from '../../../services/api/upload';
import { Client } from '../../../services/api/client';
import { AttachmentService } from '../../../services/attachment';
import { TranslationService } from '../../../services/translation';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { CommentsListComponent } from '../list/list.component';
import { TimeDiffService } from '../../../services/timediff.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityService } from '../../../common/services/activity.service';
import { Router } from '@angular/router';
import { FeaturesService } from '../../../services/features.service';
import { MediaModalComponent } from '../../media/modal/modal.component';
import isMobile from '../../../helpers/is-mobile';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-comment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  outputs: ['_delete: delete', '_saved: saved'],
  host: {
    '(keydown.esc)': 'editing = false',
  },
  templateUrl: 'comment.component.html',
  providers: [
    AttachmentService,
    {
      provide: CommentsListComponent,
      useValue: forwardRef(() => CommentsListComponent),
    },
  ],
})
export class CommentComponentV2 implements OnChanges, OnInit, AfterViewInit {
  comment: any;
  editing: boolean = false;
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;

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
  @ViewChild('batchImage', { static: false }) batchImage: ElementRef;

  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() hideToolbar: boolean = false;

  @Output() onReply = new EventEmitter();

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public translationService: TranslationService,
    private overlayModal: OverlayModalService,
    private cd: ChangeDetectorRef,
    private timeDiffService: TimeDiffService,
    private el: ElementRef,
    private router: Router,
    protected activityService: ActivityService,
    protected featuresService: FeaturesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.commentAge$ = this.timeDiffService.source.pipe(
        map(secondsElapsed => {
          return (this.comment.time_created - secondsElapsed) * 1000;
        })
      );
    }

    if (this.session.getLoggedInUser().guid === this.comment.ownerObj.guid) {
      this.showMature = true;
    }
  }

  ngAfterViewInit() {
    if (this.comment.focused) {
      this.el.nativeElement.scrollIntoView(true);
      setTimeout(() => {
        window.scrollBy(0, -200);
      }, 10);
    }
  }

  @Input('comment')
  set _comment(value: any) {
    if (!value) {
      return;
    }
    this.comment = value;
    this.attachment.load(this.comment);

    this.isTranslatable = this.translationService.isTranslatable(this.comment);
  }

  set _editing(value: boolean) {
    this.editing = value;
  }

  saveEnabled() {
    return (
      !this.inProgress &&
      this.canPost &&
      ((this.comment.description && this.comment.description.trim() !== '') ||
        this.attachment.has())
    );
  }

  save() {
    this.comment.description = this.comment.description.trim();

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
        }
        this.comment.edited = true;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  applyAndSave(control: any, e) {
    e.preventDefault();

    if (!this.saveEnabled()) {
      this.triedToPost = true;
      return;
    }

    this.comment.description = control.value;
    this.save();
  }

  cancel(control: any, e) {
    e.preventDefault();

    if (this.inProgress) {
      return;
    }

    this.editing = false;
    control.value = this.comment.description;
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

  uploadAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.triedToPost = false;

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
  }

  getPostPreview(message) {
    if (!message.value) {
      return;
    }

    this.attachment.preview(message.value);
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
    this.overlayModal.create(ReportCreatorComponent, this.comment).present();
  }

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }

  ngOnChanges(changes) {
    //  console.log('[comment:card]: on changes', changes);
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngDoCheck() {
    this.changesDetected = false;
    if (this.comment.error != this.error) {
      this.error = this.comment.error;
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

    if (!this.featuresService.has('media-modal')) {
      this.router.navigate([pageUrl]);
      return;
    } else {
      if (
        this.comment.custom_data[0].width === '0' ||
        this.comment.custom_data[0].height === '0'
      ) {
        this.setImageDimensions();
      }
      this.openModal();
    }
  }

  openModal() {
    this.comment.modal_source_url = this.router.url;

    this.overlayModal
      .create(
        MediaModalComponent,
        {
          entity: this.comment,
        },
        {
          class: 'm-overlayModal--media',
        }
      )
      .present();
  }

  /**
   * Toggles mature visibility.
   */
  toggleMatureVisibility() {
    this.showMature = !this.showMature;
  }
}
