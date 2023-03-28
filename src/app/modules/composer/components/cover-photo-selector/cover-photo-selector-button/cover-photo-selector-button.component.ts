import { Component } from '@angular/core';
import { FileUploadSelectEvent } from '../../../../../common/components/file-upload/file-upload.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ComposerService } from '../../../services/composer.service';
import { Attachment } from '../../../services/attachment.service';
import { VideoPoster } from '../../../services/video-poster.service';
import { PopupService } from '../../popup/popup.service';
import { ComposerCoverPhotoSelectorPopupComponent } from '../cover-photo-selector-popup/cover-photo-selector-popup.component';

/**
 * Opens the popup that allows users to upload custom cover photo
 * for video posts.
 * Appears in composer when user uploads a video.
 */
@Component({
  selector: 'm-composer__coverPhotoSelectorButton',
  templateUrl: './cover-photo-selector-button.component.html',
  styleUrls: ['./cover-photo-selector-button.component.ng.scss'],
})
export class ComposerCoverPhotoSelectorButtonComponent {
  filePreview: SafeResourceUrl;

  constructor(
    private service: ComposerService,
    private domSanitizer: DomSanitizer,
    protected popup: PopupService
  ) {}

  /**
   * Shows cover photo selector popup
   * @param $event
   */
  async onClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(ComposerCoverPhotoSelectorPopupComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  async onFileSelect(e: FileUploadSelectEvent): Promise<void> {
    if (!e) return; // Most likely pressed Esc on dialog
    if (!(e instanceof File)) {
      // Unsupported attachment type
      console.warn('Composer/Toolbar: Unsupported attachment type', e);
      return;
    }

    this.filePreview = this.domSanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(e)
    );

    let fileBase64: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          resolve(reader.result.toString());
        },
        false
      );
      reader.readAsDataURL(e);
    });

    const videoPoster: VideoPoster = {
      url: URL.createObjectURL(e),
      file: e,
      fileBase64,
    };

    // Emit the changed attachment
    this.service.videoPoster$.next(videoPoster);
  }

  onRemoveFileClick(e: MouseEvent): void {
    this.filePreview = null;

    // Emit the changed attachment
    this.service.videoPoster$.next(null);
  }
}
