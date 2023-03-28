import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FileUploadSelectEvent } from '../../../../../common/components/file-upload/file-upload.component';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeStyle,
} from '@angular/platform-browser';
import { ComposerService } from '../../../services/composer.service';
import { Attachment } from '../../../services/attachment.service';
import { VideoPoster } from '../../../services/video-poster.service';
import { PopupService } from '../../popup/popup.service';
import { Subscription } from 'rxjs';

/**
 * Allows users to upload a custom cover photo for a video post.
 */
@Component({
  selector: 'm-composer__coverPhotoSelectorPopup',
  templateUrl: './cover-photo-selector-popup.component.html',
  styleUrls: ['./cover-photo-selector-popup.component.ng.scss'],
})
export class ComposerCoverPhotoSelectorPopupComponent
  implements OnInit, OnDestroy {
  filePreview: SafeStyle | string;
  fileName: string = '';
  videoPoster: VideoPoster;
  videoPosterSubscription: Subscription;

  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private service: ComposerService,
    private domSanitizer: DomSanitizer,
    protected popup: PopupService
  ) {}

  ngOnInit(): void {
    this.videoPosterSubscription = this.service.videoPoster$.subscribe(
      poster => {
        if (poster && poster.url) {
          this.filePreview = `url(${poster.url})`;
          this.fileName = poster.fileName ? poster.fileName : '';
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.videoPosterSubscription?.unsubscribe();
  }

  async onFileSelect(e: FileUploadSelectEvent): Promise<void> {
    if (!e) return; // Most likely pressed Esc on dialog
    if (!(e instanceof File)) {
      // Unsupported attachment type
      console.warn('Composer/Toolbar: Unsupported attachment type', e);
      return;
    }

    this.fileName = e.name ? e.name : '';

    this.filePreview = this.domSanitizer.bypassSecurityTrustStyle(
      'url(' + URL.createObjectURL(e) + ')'
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

    this.videoPoster = {
      url: URL.createObjectURL(e),
      file: e,
      fileBase64,
    };
    if (this.fileName) {
      this.videoPoster.fileName = this.fileName;
    }
  }

  save(): void {
    // Emit the changed attachment
    this.service.videoPoster$.next(this.videoPoster);
    this.dismissIntent.emit();
  }

  onRemoveFileClick(e: MouseEvent): void {
    this.filePreview = null;
    this.fileName = '';

    // Emit the changed attachment
    this.service.videoPoster$.next(null);
  }
}
