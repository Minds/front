import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComposerService } from '../../../services/composer.service';
import { ToasterService } from '../../../../../common/services/toaster.service';

/**
 * Composer preview for audio attachments.
 */
@Component({
  selector: 'm-composerPreview--audio',
  templateUrl: './attachment-preview-audio.component.html',
  styleUrl: './attachment-preview-audio.component.ng.scss',
})
export class AttachmentPreviewAudioComponent implements OnInit {
  /** The thumbnail image file URL. */
  protected readonly thumbnailImageFileUrl$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  /** Whether the composer is in edit mode. */
  protected readonly isEditing$: Observable<boolean> =
    this.composerService.isEditing$;

  /** Whether the composer is posting. */
  protected readonly isPosting$: Observable<boolean> =
    this.composerService.isPosting$;

  constructor(
    private readonly composerService: ComposerService,
    private readonly toastService: ToasterService
  ) {}

  ngOnInit(): void {
    const audioThumbnail: string =
      this.composerService.audioThumbnail$.getValue();

    if (audioThumbnail) {
      this.thumbnailImageFileUrl$.next(`url(${audioThumbnail})`);
    }
  }

  /**
   * On thumbnail selected.
   * @param { File } file - the thumbnail image file.
   * @returns { Promise<void> }
   */
  protected async onThumbnailSelected(file: File): Promise<void> {
    this.thumbnailImageFileUrl$.next(`url(${URL.createObjectURL(file)})`);

    const fileBase64: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    this.composerService.audioThumbnail$.next(fileBase64);
  }

  /**
   * Show control disabled toast message.
   * @returns { void }
   */
  protected showControlDisabledToast(): void {
    this.toastService.inform(
      'Playback is only available after a post has been made'
    );
  }

  /**
   * Removes an audio attachment.
   * @returns { void }
   */
  protected removeAttachment(): void {
    this.composerService.removeAudioAttachment();
  }
}
