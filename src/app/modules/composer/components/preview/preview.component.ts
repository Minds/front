import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ComposerService } from '../../services/composer.service';

/**
 * Composer preview container. Renders a user-friendly preview of
 * the embedded media or rich embed, and allows to change the video
 * thumbnails and delete the embed as well.
 */
@Component({
  selector: 'm-composer__preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'preview.component.html',
})
export class PreviewComponent {
  /**
   * The attachment preview metadata subject from the service
   */
  attachmentPreview$ = this.service.attachmentPreview$;

  /**
   * The rich embed preview metadata subject from the service
   */
  richEmbedPreview$ = this.service.richEmbedPreview$;

  isPosting$ = this.service.isPosting$;

  /**
   * Is the media in portrait mode?
   */
  portrait: boolean = false;

  /**
   * Constructor.
   * @param service
   * @param cd
   */
  constructor(
    protected service: ComposerService,
    protected cd: ChangeDetectorRef
  ) {}

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
  remove() {
    // TODO: Implement a nice themed modal confirmation
    if (confirm("Are you sure? There's no UNDO.")) {
      this.service.removeAttachment();
    }
  }

  /**
   * Detects changes
   */
  detectChanges() {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}
