import { Component } from '@angular/core';
import { FileUploadSelectEvent } from '../../../../common/components/file-upload/file-upload.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ComposerService } from '../../services/composer.service';
import { Attachment } from '../../services/attachment.service';
import { VideoPoster } from '../../services/video-poster.service';

/**
 * Allows users to upload a custom cover photo for a video post.
 * Used in <m-composer__previewWrapper>
 */
@Component({
  selector: 'm-composer__coverPhotoSelector',
  templateUrl: './cover-photo-selector.component.html',
})
export class ComposerCoverPhotoSelectorComponent {
  isExpanded = false;
  filePreview: SafeResourceUrl;

  constructor(
    private service: ComposerService,
    private domSanitizer: DomSanitizer
  ) {}

  onExpandToggle(e: MouseEvent): void {
    this.isExpanded = !this.isExpanded;
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

    // Un-expand itself
    this.isExpanded = false;
  }

  onRemoveFileClick(e: MouseEvent): void {
    this.filePreview = null;

    // Emit the changed attachment
    this.service.videoPoster$.next(null);
  }
}
