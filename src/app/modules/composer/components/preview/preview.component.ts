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
   * Gets the attachment preview metadata subject from the service
   */
  get attachmentPreview$() {
    return this.service.attachmentPreview$;
  }

  /**
   * Gets the rich embed preview metadata subject from the service
   */
  get richEmbedPreview$() {
    return this.service.richEmbedPreview$;
  }

  /**
   * Is posting flag from the service
   */
  get isPosting$() {
    return this.service.isPosting$;
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
