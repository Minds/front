import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { GlobalAudioPlayerService } from '../../services/global-audio-player.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

/**
 * Global audio player component. This component is used to play audio in
 * the background - it has no UI and is controlled by the GlobalAudioPlayerService.
 * This service is synced to by individual audio players and their local services
 * in feeds, so that only one audio player can be playing at a time.
 */
@Component({
  selector: 'm-globalAudioPlayer',
  template: ` <audio #nativeAudio [src]="currentAudioSrc$ | async"></audio> `,
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

  constructor(private globalAudioPlayerService: GlobalAudioPlayerService) {}

  ngAfterViewInit(): void {
    // Register with the global audio player service, and initialise it.
    this.globalAudioPlayerService.setAudioElement(this.audioElement).init();
  }
}
