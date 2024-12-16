import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComposerService } from '../../../services/composer.service';

/**
 * Composer preview for audio attachments.
 */
@Component({
  selector: 'm-composerPreview--audio',
  templateUrl: './attachment-preview-audio.component.html',
  styleUrl: './attachment-preview-audio.component.ng.scss',
})
export class AttachmentPreviewAudioComponent implements OnInit {
  /** The audio preview source URL. */
  @Input() set src(value: string) {
    this.onPreviewSrcUrlChange(value);
  }

  /** The thumbnail image file URL. */
  protected readonly thumbnailImageFileUrl$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  /** Whether the composer is in edit mode. */
  protected readonly isEditing$: Observable<boolean> =
    this.composerService.isEditing$;

  /** Whether the composer is posting. */
  protected readonly isPosting$: Observable<boolean> =
    this.composerService.isPosting$;

  /** Whether the audio is playing. */
  protected readonly playing$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** The audio player. */
  private audioPlayer: HTMLAudioElement;

  constructor(private readonly composerService: ComposerService) {}

  ngOnInit(): void {
    const audioThumbnail: string =
      this.composerService.audioThumbnail$.getValue();

    if (audioThumbnail) {
      this.thumbnailImageFileUrl$.next(`url(${audioThumbnail})`);
    }
  }

  ngOnDestroy(): void {
    this.destroyCurrentPlayer();
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
   * Removes an audio attachment.
   * @returns { void }
   */
  protected removeAttachment(): void {
    this.composerService.removeAudioAttachment();
  }

  /**
   * Plays the audio.
   * @returns { void }
   */
  protected playAudio(): void {
    try {
      this.audioPlayer.play();
      this.playing$.next(true);
    } catch (e) {
      console.error('Error creating audio:', e);
    }
  }

  /**
   * Pauses the audio.
   * @returns { void }
   */
  protected pauseAudio(): void {
    try {
      this.audioPlayer.pause();
      this.playing$.next(false);
    } catch (e) {
      console.error('Error pausing audio:', e);
    }
  }

  /**
   * Toggles the audio playback.
   * @returns { void }
   */
  protected toggleAudioPlayback(): void {
    if (this.playing$.getValue()) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  /**
   * Skips the audio backward.
   * @returns { void }
   */
  protected skipBackward(): void {
    this.audioPlayer.currentTime -= 10;
  }

  /**
   * Skips the audio forward.
   * @returns { void }
   */
  protected skipForward(): void {
    this.audioPlayer.currentTime += 10;
  }

  /**
   * Handles the preview source URL change.
   * @param { string } value - the preview source URL.
   * @returns { void }
   */
  private onPreviewSrcUrlChange(value: string): void {
    // If playing, we have a URL already, don't update it and stop playback.
    if (!value || this.playing$.getValue()) {
      return;
    }

    try {
      const newPlayer = new Audio(value);

      if (newPlayer) {
        if (this.audioPlayer) {
          this.destroyCurrentPlayer();
        }

        this.audioPlayer = newPlayer;
        this.audioPlayer.onended = () => {
          this.playing$.next(false);
        };
      }
    } catch (e) {
      // Do nothing.
    }
  }

  /**
   * Destroys the current audio player.
   * @returns { void }
   */
  private destroyCurrentPlayer(): void {
    if (!this.audioPlayer) {
      return;
    }

    try {
      this.audioPlayer.pause();
      this.audioPlayer.src = null;
      delete this.audioPlayer;
    } catch (e) {
      console.error('Error stopping audio:', e);
    }
  }
}
