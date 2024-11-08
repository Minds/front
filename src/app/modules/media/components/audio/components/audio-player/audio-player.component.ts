import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe, CommonModule as NgCommonModule } from '@angular/common';
import { BehaviorSubject, debounceTime, Observable } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { AudioPlayerService } from '../../services/audio-player.service';
import { AudioTimePipe } from '../../pipes/audio-time.pipe';
import { ContextualizableEntity } from '../../../../../../services/analytics';
import { AudioPlayerAnalyticsService } from '../../services/audio-player-analytics.service';
import { AudioPlaybackState } from '../../types/audio-player.types';

/**
 * Audio player component.
 */
@Component({
  selector: 'm-audioPlayer',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.ng.scss',
  imports: [AsyncPipe, AudioTimePipe, MatSliderModule, NgCommonModule],
  providers: [AudioPlayerService, AudioPlayerAnalyticsService],
  standalone: true,
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  /** Enum for use in template. */
  protected readonly AudioPlaybackState: typeof AudioPlaybackState =
    AudioPlaybackState;

  /** Audio source. */
  @Input() protected src: string = '';

  /** Thumbnail source. */
  @Input() protected thumbnailSrc: string = '';

  /** Author. */
  @Input() protected author: string = '';

  /** Title. */
  @Input() protected title: string = '';

  /** Total duration. */
  @Input() protected duration: number = 1;

  /** Contextualizable entity that the audio belongs to. */
  @Input() private entity: ContextualizableEntity = null;

  /** Current audio time. */
  protected currentAudioTime$: Observable<number> =
    this.audioPlayerService.currentAudioTime$.pipe(
      // Improve performance when quickly dragging the seek bar.
      debounceTime(15)
    );

  /** Buffered percentage. */
  protected bufferedPercentage$: Observable<number> =
    this.audioPlayerService.bufferedPercentage$;

  /** The current audio playback state. */
  protected audioPlaybackState$: Observable<AudioPlaybackState> =
    this.audioPlayerService.audioPlaybackState$;

  /** Whether the audio is playing. */
  protected playing$: Observable<boolean> = this.audioPlayerService.playing$;

  /** Volume. */
  protected volume$: Observable<number> = this.audioPlayerService.volume$;

  /** Whether the audio is muted. */
  protected muted$: Observable<boolean> = this.audioPlayerService.muted$;

  /**
   * Duration of the audio track - unlike the input which is used for init, this
   * value will change if a difference is detected upon loading the audio.
   */
  protected duration$: Observable<number> = this.audioPlayerService.duration$;

  /** Whether the audio is loading. */
  protected loading$: Observable<boolean> = this.audioPlayerService.loading$;

  /** Whether the mouse is over the player. */
  protected isMouseOver: boolean = false;

  /** Whether the thumbnail container is hovered. */
  protected thumbnailContainerHovered$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Mouse enter listener. */
  @HostListener('mouseenter')
  protected onMouseEnter(): void {
    this.isMouseOver = true;
  }

  /** Mouse leave listener. */
  @HostListener('mouseleave')
  protected onMouseLeave(): void {
    this.isMouseOver = false;
  }

  /** Left arrow key listener. */
  @HostListener('document:keydown.arrowLeft', ['$event'])
  protected onLeftArrowKeyDown(event: KeyboardEvent): void {
    if (this.isMouseOver && this.audioPlayerService.isActivePlayer) {
      event.preventDefault();
      this.onSkipBackClick();
    }
  }

  /** Right arrow key listener. */
  @HostListener('document:keydown.arrowRight', ['$event'])
  protected onRightArrowKeyDown(event: KeyboardEvent): void {
    if (this.isMouseOver && this.audioPlayerService.isActivePlayer) {
      event.preventDefault();
      this.onSkipForwardClick();
    }
  }

  /** Space key listener. */
  @HostListener('document:keydown.space', ['$event'])
  protected onSpaceKeyDown(event: KeyboardEvent): void {
    if (this.isMouseOver) {
      event.preventDefault();

      if (this.audioPlayerService.playing$.getValue()) {
        this.onPauseClick();
      } else {
        this.onPlayClick();
      }
    }
  }

  constructor(private audioPlayerService: AudioPlayerService) {}

  ngOnInit(): void {
    this.audioPlayerService.setAudioTrack({
      src: this.src,
      duration: this.duration,
    });
    this.audioPlayerService.setAnalyticsEntity(this.entity);
  }

  ngOnDestroy(): void {
    this.audioPlayerService.reset();
  }

  /**
   * Handle play button click.
   * @returns { Promise<void> }
   */
  protected async onPlayClick(): Promise<void> {
    this.audioPlayerService.play();
  }

  /**
   * Handle pause button click.
   * @returns { void }
   */
  protected onPauseClick(): void {
    this.audioPlayerService.pause();
  }

  /**
   * Handle skip back button click.
   * @returns { Promise<void> }
   */
  protected async onSkipBackClick(): Promise<void> {
    this.audioPlayerService.skipBack();
  }

  /**
   * Handle skip forward button click.
   * @returns { Promise<void> }
   */
  protected async onSkipForwardClick(): Promise<void> {
    this.audioPlayerService.skipForward();
  }

  /**
   * Handle seek event.
   * @param { Event & { target: HTMLInputElement } } $event - Event.
   * @returns { Promise<void> }
   */
  protected async onSeek(
    $event: Event & { target: HTMLInputElement }
  ): Promise<void> {
    this.audioPlayerService.seek(Number($event.target.value));
  }

  /**
   * Handle volume change event.
   * @param { Event & { target: HTMLInputElement } } volumeValue - Volume value.
   * @returns { void }
   */
  protected onVolumeChange(
    volumeValue: Event & { target: HTMLInputElement }
  ): void {
    this.audioPlayerService.setVolume(Number(volumeValue.target.value));
  }

  /**
   * Handle volume icon click.
   * @returns { void }
   */
  protected onVolumeIconClick(): void {
    this.audioPlayerService.toggleMute();
  }

  /**
   * Handle mouse over thumbnail container.
   * @returns { void }
   */
  protected onMouseOverThumbnailContainer(): void {
    this.thumbnailContainerHovered$.next(true);
  }

  /**
   * Handle mouse leave thumbnail container.
   * @returns { void }
   */
  protected onMouseLeaveThumbnailContainer(): void {
    this.thumbnailContainerHovered$.next(false);
  }
}
