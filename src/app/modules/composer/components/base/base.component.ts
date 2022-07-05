import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Output,
  ViewChild,
  Input,
} from '@angular/core';
import { UniqueId } from '../../../../helpers/unique-id.helper';
import {
  ComposerService,
  ComposerSize,
  RemindSubjectValue,
} from '../../services/composer.service';
import { PopupService } from '../popup/popup.service';
import { PopupComponent } from '../popup/popup.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { Router } from '@angular/router';
import { InMemoryStorageService } from '../../../../services/in-memory-storage.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { FeaturesService } from '../../../../services/features.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { first, map, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogPreloadService } from '../../../blogs/v2/edit/blog-preload.service';

/**
 * Base component for composer. It contains all the parts.
 * Used to compose all activity types except for blogs and reminds.
 */
@Component({
  selector: 'm-composer__base',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'base.component.html',
  providers: [PopupService],
})
export class BaseComponent implements AfterViewInit {
  /**
   * Post event emitter
   */
  @Output('onPost') onPostEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Is the composer in a modal?
   */
  @Input() isModal: boolean = false;

  /**
   * Popup component ref
   */
  @ViewChild('popupComponent', { static: true }) popupComponent: PopupComponent;

  /**
   * Text area component ref
   */
  @ViewChild('textAreaComponent', { static: true })
  textAreaComponent: TextAreaComponent;

  /**
   * Unique ID for textarea
   */
  textareaId: string = UniqueId.generate('m-composer__textarea');

  /**
   * Last error
   */
  error: string;

  /**
   * The urn of the Minds+ support tier
   */
  private readonly plusTierUrn: string;

  /**
   * Remind subject
   */
  remind$: Observable<RemindSubjectValue> = this.service.remind$;

  /**
   * Constructor
   * @param service
   * @param popup
   * @param router
   * @param inMemoryStorage
   * @param cd
   * @param injector
   */
  constructor(
    protected service: ComposerService,
    protected popup: PopupService,
    protected router: Router,
    protected inMemoryStorage: InMemoryStorageService,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    protected toasterService: FormToastService,
    protected featuresService: FeaturesService,
    protected blogPreloadService: BlogPreloadService,
    configs: ConfigsService
  ) {
    this.plusTierUrn = configs.get('plus').support_tier_urn;

    this.attachmentError$.pipe(distinctUntilChanged()).subscribe(error => {
      if (error) {
        this.service.removeAttachment();
      }
    });
  }

  /**
   * Initializes after all components were injected
   */
  ngAfterViewInit(): void {
    this.popup.setUp(this.popupComponent, this.injector);
  }

  /**
   * Attachment preview subject in service
   */
  get attachmentPreview$() {
    return this.service.attachmentPreview$;
  }

  /**
   * Rich embed preview subject in service
   */
  get richEmbedPreview$() {
    return this.service.richEmbedPreview$;
  }

  /**
   * In progress boolean subject in service
   */
  get inProgress$() {
    return this.service.inProgress$;
  }

  /**
   * Progress percentage subject in service
   */
  get progress$() {
    return this.service.progress$;
  }

  /**
   * Composer size from service.
   * @returns { BehaviorSubject<ComposerSize> } - Composer size.
   */
  get size$(): BehaviorSubject<ComposerSize> {
    return this.service.size$;
  }

  /**
   * Compact mode if size is compact and NOT in a modal.
   * @returns { Observable<boolean> } - holds true if compact mode should be applied.
   */
  get isCompactMode$(): Observable<boolean> {
    return this.size$.pipe(map(size => size === 'compact' && !this.isModal));
  }

  /**
   * Attachment error subject in service
   */
  get attachmentError$() {
    return this.service.attachmentError$;
  }

  /**
   * Focuses the main text area
   */
  focus() {
    this.textAreaComponent.focus();
  }

  /**
   * Creates a blog using the current message
   */
  createBlog() {
    const message = this.service.message$.getValue();

    this.service.isMovingContent$.next(true);
    this.inMemoryStorage.set('newBlogContent', message);

    if (this.popupComponent) {
      this.popup.close();
    }

    this.blogPreloadService.next(message);
    this.router.navigate(['/blog/v2/edit/new']);
  }

  /**
   * Updates the attachment. Called when pasting an image or video.
   * @param file
   */
  onAttachmentPaste(file) {
    this.service.attachment$.next(file);
  }

  /**
   * Ensure Minds+ posts follow the rules
   */
  async meetsPlusPostRequirements(): Promise<boolean> {
    const mon = this.service.monetization$.getValue();
    const isPlusPost =
      mon && mon.support_tier && mon.support_tier.urn === this.plusTierUrn;

    if (!isPlusPost) {
      return true;
    }

    // Cannot be an external link
    const richEmbed = this.service.richEmbed$.getValue();
    const messageUrl = await this.service.messageUrl$.pipe(first()).toPromise();

    if (
      messageUrl ||
      (richEmbed && !this.richEmbedPreview$.getValue().entityGuid)
    ) {
      this.toasterService.error('Minds+ posts cannot be external links');
      return false;
    }

    // Must have 1+ hashtags
    if (this.service.tagCount$.getValue() < 1) {
      this.toasterService.error('Minds+ posts must have at least one hashtag');
      return false;
    }

    // Can not be NSFW
    if (this.service.nsfw$.getValue().length > 0) {
      this.toasterService.error('Minds+ posts can not be NSFW');
      return false;
    }

    return true;
  }

  /**
   * Post intent
   * @param event
   */
  async onPost(event) {
    if (!(await this.meetsPlusPostRequirements())) {
      return;
    }

    try {
      this.error = '';
      this.detectChanges();

      const activity = await this.service.post();
      this.onPostEmitter.next(activity);
    } catch (e) {
      this.error = (e && e.message) || 'Internal error';

      if (e.error && e.error.message) {
        this.error = e.error.message;
      }

      this.toasterService.error(this.error);
    }

    this.detectChanges();
  }

  /**
   * Displays a dialog if there are any unsaved change
   */
  canDeactivate(): boolean | Promise<boolean> {
    if (
      this.service.message$.getValue() ||
      this.service.attachment$.getValue()
    ) {
      const confirmation = confirm(
        this.service.isMovingContent$.getValue()
          ? `Are you sure? The existing text will be moved into the blog editor.`
          : `Discard changes?`
      );

      this.service.isMovingContent$.next(false);

      return confirmation;
    }

    return true;
  }

  /**
   * Detect async changes
   */
  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
