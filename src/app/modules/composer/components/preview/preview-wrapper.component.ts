import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ComposerService,
  DEFAULT_RICH_EMBED_VALUE,
} from '../../services/composer.service';
import { UploaderService } from '../../services/uploader.service';

/**
 * Composer preview wrapper. Renders a user-friendly preview of
 * the embedded media/rich-embed.
 *
 * Also allows user to change the video
 * thumbnails and delete the embed.
 *
 * Previews for quote posts are elsewhere, in the composer base.
 */
@Component({
  selector: 'm-composer__previewWrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'preview-wrapper.component.html',
  styleUrls: ['./preview-wrapper.component.ng.scss'],
})
export class PreviewWrapperComponent implements OnInit, OnDestroy {
  /**
   * The attachment preview metadata subject from the service
   */
  attachmentPreviews$ = this.service.attachmentPreviews$;

  /**
   * The attachment preview snapshot data
   */
  attachmentPreviews = [];

  /**
   * The rich embed preview metadata subject from the service
   */
  richEmbedPreview$ = this.service.richEmbedPreview$;

  /**
   * The rich embed snapshot data
   */
  richEmbedPreview = null;

  /**
   * The extracted URL from the message
   */
  messageUrl$ = this.service.messageUrl$;

  /**
   * Are we posting?
   */
  isPosting$ = this.service.isPosting$;

  /**
   * Is the media in portrait mode?
   */
  portrait: boolean = false;

  /**
   * Are we editing?
   */
  isEditing$ = this.service.isEditing$;

  /**
   * Subscriptions for creating the snapshots
   */
  subscriptions: Subscription[];

  /**
   * Constructor.
   * @param service
   * @param cd
   */
  constructor(
    protected service: ComposerService,
    protected uploaderSevice: UploaderService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions = [
      this.attachmentPreviews$.subscribe(attachmentPreviews => {
        this.attachmentPreviews = attachmentPreviews;
        this.detectChanges();
      }),
      this.richEmbedPreview$.subscribe(richEmbedPreview => {
        this.richEmbedPreview = richEmbedPreview;
        this.detectChanges();
      }),
    ];
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Sets the portrait mode
   * @param portrait
   */
  setPortrait(portrait: boolean) {
    if (portrait !== this.portrait) {
      this.portrait = portrait;
    }
  }

  /**
   * Removes the attachment using the service
   */
  removeAttachment(file: File) {
    // TODO: Implement a nice themed modal confirmation
    if (confirm("Are you sure? There's no UNDO.")) {
      this.uploaderSevice.stopFile$$.next(file);
    }
  }

  /**
   * Removes the rich embed using the service
   */
  removeRichEmbed() {
    this.service.removeRichEmbed();
  }

  /**
   * Detects changes
   */
  detectChanges() {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}
