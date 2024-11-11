import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { GlobalAudioPlayerService } from '../../services/global-audio-player.service';
import { firstValueFrom, Observable } from 'rxjs';
import { AsyncPipe, isPlatformServer } from '@angular/common';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { AudioTrack } from '../../types/audio-player.types';
import { Upload } from '../../../../../../services/api';

/**
 * Global audio player component. This component is used to play audio in
 * the background - it has no UI and is controlled by the GlobalAudioPlayerService.
 * This service is synced to by individual audio players and their local services
 * in feeds, so that only one audio player can be playing at a time.
 */
@Component({
  selector: 'm-globalAudioPlayer',
  template: `
    <audio
      #nativeAudio
      [src]="currentAudioSrc$ | async"
      (error)="onError($event)"
    ></audio>
  `,
  styles: [
    `
      :host {
        display: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  standalone: true,
})
export class GlobalAudioPlayerComponent implements AfterViewInit {
  /** Reference to the audio element. */
  @ViewChild('nativeAudio') public audioElement: ElementRef;

  /** Observable of the current audio source. */
  protected readonly currentAudioSrc$: Observable<string> =
    this.globalAudioPlayerService.currentAudioSrc$;

  constructor(
    private globalAudioPlayerService: GlobalAudioPlayerService,
    private toasterService: ToasterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    // Register with the global audio player service, and initialise it.
    this.globalAudioPlayerService.setAudioElement(this.audioElement).init();
  }

  /**
   * Handle audio error.
   * @param { any } event - The error event.
   * @returns { Promise<void> }
   */
  protected async onError(event: any): Promise<void> {
    const currentAudioTrack: AudioTrack = await firstValueFrom(
      this.globalAudioPlayerService.currentAudioTrack$
    );

    if (!currentAudioTrack) {
      return;
    }

    console.error(event);

    if (!currentAudioTrack.duration || !currentAudioTrack.src) {
      this.toasterService.inform('Still processing. Please try again shortly.');
    } else {
      this.toasterService.error('There was an error loading this audio file');
    }
  }
}
