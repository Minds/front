import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Output,
  ViewChild,
} from '@angular/core';
import { UniqueId } from '../../../../helpers/unique-id.helper';
import { ButtonComponentAction } from '../../../../common/components/button-v2/button.component';
import { ComposerService, ContentType } from '../../services/composer.service';
import { PopupService } from '../popup/popup.service';
import { PopupComponent } from '../popup/popup.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { Router } from '@angular/router';
import { InMemoryStorageService } from '../../../../services/in-memory-storage.service';
import { BehaviorSubject } from 'rxjs';
import { ComposerBlogsService } from '../../services/composer-blogs.service';
import { ActivityEntity } from '../../../newsfeed/activity/activity.service';

/**
 * Base component for composer. It contains all the parts.
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
    protected blogsService: ComposerBlogsService,
    protected injector: Injector
  ) {}

  /**
   * Initializes after all components were injected
   */
  ngAfterViewInit(): void {
    this.popup.setUp(this.popupComponent, this.injector);
  }

  /**
   * Blogs service error
   */
  get blogsError$(): BehaviorSubject<string> {
    return this.blogsService.error$;
  }

  /**
   * Attachment preview subject in service
   */
  get attachmentPreview$() {
    return this.service.attachmentPreview$;
  }

  /**
   * Content type subject in service.
   */
  get contentType$(): BehaviorSubject<ContentType> {
    return this.service.contentType$;
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
   * Sets contentType to 'blog' to dynamically switch the window.
   */
  createBlog() {
    this.service.contentType$.next('blog');
  }

  /**
   * Updates the attachment. Called when pasting an image or video.
   * @param file
   */
  onAttachmentPaste(file) {
    if (this.service.contentType$.getValue() === 'blog') {
      this.service.attachment$.next(file);
    }
  }

  /**
   * Post intent
   * @param event
   */
  async onPost(event: ButtonComponentAction) {
    try {
      this.error = '';
      this.detectChanges();
      let activity: ActivityEntity | null;
      if (this.service.contentType$.getValue() === 'post') {
        activity = await this.service.post();
      } else {
        // redirects
        return await this.blogsService.save();
      }
      this.onPostEmitter.next(activity);
    } catch (e) {
      this.error = (e && e.message) || 'Internal error';
    }

    this.detectChanges();
  }

  /**
   * Displays a dialog if there are any unsaved change
   */
  canDeactivate(): boolean | Promise<boolean> {
    if (this.shouldConfirmDeactivation()) {
      const confirmation = confirm(
        this.service.isMovingContent$.getValue()
          ? `Discard changes? Text will be moved into blog editor.`
          : `Discard changes?`
      );

      this.service.isMovingContent$.next(false);

      return confirmation;
    }

    return true;
  }

  /**
   * Determines whether component should show prompt before deactivation.
   * @returns true if prompt should be shown.
   */
  shouldConfirmDeactivation(): boolean {
    return (
      (this.service.hasContent() &&
        this.service.contentType$.getValue() === 'post') ||
      (this.blogsService.hasContent() &&
        this.service.contentType$.getValue() === 'blog')
    );
  }

  /**
   * Detect async changes
   */
  detectChanges(): void {
    if (!this.cd['destroyed']) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
