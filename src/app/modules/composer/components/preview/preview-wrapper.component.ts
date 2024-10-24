import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ComposerService } from '../../services/composer.service';
import { AttachmentPreviewResource } from '../../services/preview.service';
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
      this.attachmentPreviews$.subscribe((attachmentPreviews) => {
        this.processIncomingMediaAttachmentData(attachmentPreviews);
      }),
      this.richEmbedPreview$.subscribe((richEmbedPreview) => {
        this.richEmbedPreview = richEmbedPreview;
        this.detectChanges();
      }),
    ];
  }

  /**
   * For media uploads, we only want to detect changes
   * for limited scenarios/properties. This prevents
   * visual flickering that would happen if we
   * re-rendered the entire preview every time the
   * progress bar status changes
   * @param incomingPreviews
   */
  processIncomingMediaAttachmentData(
    incomingPreviews: AttachmentPreviewResource[]
  ): void {
    const currentLength = this.attachmentPreviews?.length || 0;
    const incomingLength = incomingPreviews?.length || 0;

    // ---------------------------------------------------
    // HANDLE UNKNOWN AND DELETED PREVIEWS
    // If initializing or deleting,
    // overwrite any existing previews with incoming ones
    // ---------------------------------------------------
    const everythingIsNew = currentLength === 0;
    const incomingDelete = currentLength > incomingLength;

    if (everythingIsNew || incomingDelete) {
      this.attachmentPreviews = incomingPreviews;
      this.detectChanges();
      return;
    }

    // ---------------------------------------------------
    // FOR EVERYTHING ELSE, PROCESS AS A SEPARATE FILE
    // So we only update/refresh the data that we need
    // ---------------------------------------------------
    const maxLength = Math.max(currentLength, incomingLength);

    for (let i = 0; i < maxLength; ++i) {
      // ---------------------------------------------------
      // NEW MULTI-IMAGE ADDED TO EXISTING ARRAY
      // Render it and move on to the next file
      // ---------------------------------------------------
      if (!this.attachmentPreviews[i]) {
        this.attachmentPreviews[i] = incomingPreviews[i];
        this.detectChanges();
        break;
      }

      // The progress has just changed to a non-zero number
      const justStartedUploading =
        (!this.attachmentPreviews[i].progress ||
          this.attachmentPreviews[i].progress === 0) &&
        incomingPreviews[i]?.progress > 0;

      if (incomingPreviews[i].guid) {
        // ---------------------------------------------------
        // FINISHED UPLOADING
        // Update guid only, so the progress bar stops
        // ---------------------------------------------------
        this.attachmentPreviews[i].guid = incomingPreviews[i].guid;
      } else if (justStartedUploading) {
        // ---------------------------------------------------
        // JUST STARTED UPLOADING
        // Update the entire preview so we can see the thumbnail
        // ---------------------------------------------------
        this.attachmentPreviews[i] = incomingPreviews[i];
      } else {
        // ---------------------------------------------------
        // ALREADY UPLOADING
        // Just update progress bar value
        // ---------------------------------------------------
        this.attachmentPreviews[i].progress = incomingPreviews[i].progress;
      }
      this.detectChanges();
    }
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
