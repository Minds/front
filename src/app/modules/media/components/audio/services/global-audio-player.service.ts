import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { AudioTrack } from '../types/audio-player.types';
import {
  BehaviorSubject,
  fromEvent,
  map,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { AudioPlayerService } from './audio-player.service';

/**
 * Global audio player service. Controls registered global audio player
 * in the background. Individual audio players and their services register
 * and sync with the global player to play and control their audio, such
 * that there is only one audio player active at a time.
 */
@Injectable({ providedIn: 'root' })
export class GlobalAudioPlayerService implements OnDestroy {
  /** Current audio track. */
  public readonly currentAudioTrack$: BehaviorSubject<AudioTrack> =
    new BehaviorSubject(null);

  /** Played audio track. */
  public readonly played$: Subject<AudioTrack> = new Subject<AudioTrack>();

  /** Current audio src. */
  public readonly currentAudioSrc$: Observable<string> =
    this.currentAudioTrack$.pipe(map((track) => track?.src));

  /** Audio element. */
  private audioElement: ElementRef<HTMLAudioElement>;

  /** Active audio player service. */
  private audioPlayerService: AudioPlayerService;

  // Subscriptions.
  private timeUpdatedSubscription: Subscription;
  private loadedMetadataSubscription: Subscription;

  ngOnDestroy(): void {
    this.unregisterActiveAudioPlayerService();
    this.timeUpdatedSubscription?.unsubscribe();
    this.loadedMetadataSubscription?.unsubscribe();
  }

  /**
   * Set audio element.
   * @param { ElementRef<HTMLAudioElement> } audioPlayer - Audio player element.
   * @returns { GlobalAudioPlayerService }
   */
  public setAudioElement(
    audioPlayer: ElementRef<HTMLAudioElement>
  ): GlobalAudioPlayerService {
    this.audioElement = audioPlayer;
    return this;
  }

  /**
   * Register active audio player service.
   * @param { AudioPlayerService } service - Audio player service.
   * @returns { GlobalAudioPlayerService }
   */
  public registerActiveAudioPlayerService(
    service: AudioPlayerService
  ): GlobalAudioPlayerService {
    this.unregisterActiveAudioPlayerService();
    this.audioPlayerService = service;
    return this;
  }

  /**
   * Unregister active audio player service.
   * @returns { GlobalAudioPlayerService }
   */
  public unregisterActiveAudioPlayerService(): GlobalAudioPlayerService {
    this.audioPlayerService?.onUnregisterActivePlayer();
    this.audioPlayerService = null;
    return this;
  }

  /**
   * Init global audio player service.
   * @returns { void }
   */
  public init(): void {
    this.timeUpdatedSubscription = fromEvent(
      this.audioElement?.nativeElement,
      'timeupdate'
    ).subscribe(() => {
      // sync current audio time.
      this.audioPlayerService?.currentAudioTime$.next(
        Math.floor(this.audioElement.nativeElement.currentTime)
      );

      if (this.audioElement?.nativeElement.ended) {
        this.audioElement?.nativeElement.pause();
        this.audioPlayerService?.playing$.next(false);
      }
    });

    this.loadedMetadataSubscription = fromEvent(
      this.audioElement.nativeElement,
      'loadedmetadata'
    ).subscribe(() => {
      this.audioPlayerService?.loaded$.next(true);
    });
  }

  /**
   * Load track.
   * @param { AudioTrack } track - Audio track.
   * @returns { GlobalAudioPlayerService }
   */
  public loadTrack(track: AudioTrack): GlobalAudioPlayerService {
    this.currentAudioTrack$.next(track);
    return this;
  }

  /**
   * Play audio.
   * @returns { void }
   */
  public play(): void {
    setTimeout(() => {
      if (this.audioElement?.nativeElement.ended) {
        this.audioElement.nativeElement.currentTime = 0;
      } else {
        this.audioElement.nativeElement.currentTime =
          this.audioPlayerService?.currentAudioTime$.getValue() ?? 0;
      }

      this.audioElement?.nativeElement.play();
      this.audioPlayerService?.playing$.next(true);
      this.played$.next(this.currentAudioTrack$.getValue());
    }, 0);
  }

  /**
   * Pause audio.
   * @returns { void }
   */
  public pause(): void {
    this.audioElement?.nativeElement.pause();
    this.audioPlayerService?.playing$.next(false);
  }

  /**
   * Clear current audio track.
   * @returns { void }
   */
  public clearCurrentAudioTrack(): void {
    this.currentAudioTrack$.next(null);
  }

  /**
   * Seek to time.
   * @param { number } seekAudioValue - Seek audio value.
   * @returns { void }
   */
  public seek(seekAudioValue: number): void {
    this.audioElement.nativeElement.currentTime = seekAudioValue;
    this.audioPlayerService?.currentAudioTime$.next(seekAudioValue);
  }

  /**
   * Skip back.
   * @param { number } duration - Duration.
   * @returns { void }
   */
  public skipBack(duration: number = 10): void {
    this.audioElement.nativeElement.currentTime -= duration;
    this.audioPlayerService?.currentAudioTime$.next(
      this.audioElement.nativeElement.currentTime
    );
  }

  /**
   * Skip forward.
   * @param { number } duration - Duration.
   * @returns { void }
   */
  public skipForward(duration: number = 10): void {
    this.audioElement.nativeElement.currentTime += duration;
    this.audioPlayerService?.currentAudioTime$.next(
      this.audioElement.nativeElement.currentTime
    );

    if (this.audioElement?.nativeElement.ended) {
      this.audioPlayerService?.playing$.next(false);
    }
  }

  /**
   * Set volume.
   * @param { number } value - Volume value.
   * @returns { void }
   */
  public setVolume(value: number): void {
    this.audioElement.nativeElement.volume = value / 100;
    this.audioPlayerService?.volume$.next(value);
  }

  /**
   * Mute audio.
   * @returns { void }
   */
  public mute(): void {
    this.audioElement.nativeElement.muted = true;
    this.audioPlayerService?.muted$.next(true);
  }

  /**
   * Unmute audio.
   * @returns { void }
   */
  public unmute(): void {
    this.audioElement.nativeElement.muted = false;
    this.audioPlayerService?.muted$.next(false);
  }
}
