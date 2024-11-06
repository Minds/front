import { Injectable } from '@angular/core';
import { AudioTrack } from '../types/audio-player.types';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { GlobalAudioPlayerService } from './global-audio-player.service';
import { AudioPlayerAnalyticsService } from './audio-player-analytics.service';
import { ContextualizableEntity } from '../../../../../services/analytics';

/**
 * Service that controls an individual audio player.
 * State is synced with the global audio player service such that only
 * one audio player can be active at any time.
 */
@Injectable()
export class AudioPlayerService {
  /** The current audio track. */
  public readonly audioTrack$: BehaviorSubject<AudioTrack> =
    new BehaviorSubject<AudioTrack>(null);

  /** The current audio time. */
  public readonly currentAudioTime$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  /** Whether the audio has loaded. */
  public readonly loaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether the audio is playing. */
  public readonly playing$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** The current volume. */
  public readonly volume$: BehaviorSubject<number> =
    new BehaviorSubject<number>(100);

  /** Whether the audio is muted. */
  public readonly muted$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** The duration of the current audio track. */
  public readonly duration$: Observable<number> = this.audioTrack$.pipe(
    map((track) => track?.duration)
  );

  /** Whether the audio player is active. */
  public isActivePlayer: boolean = false;

  constructor(
    private readonly globalAudioPlayerService: GlobalAudioPlayerService,
    private readonly audioPlayerAnalyticsService: AudioPlayerAnalyticsService
  ) {}

  /**
   * Registers the audio player as the active player with the global service.
   * @returns { AudioPlayerService }
   */
  public registerActivePlayer(): AudioPlayerService {
    this.globalAudioPlayerService.registerActiveAudioPlayerService(this);
    this.isActivePlayer = true;
    return this;
  }

  /**
   * Unregisters the audio player as the active player with the global service.
   * and pauses the audio.
   * @returns { AudioPlayerService }
   */
  public onUnregisterActivePlayer(): AudioPlayerService {
    this.pause();
    this.isActivePlayer = false;
    return this;
  }

  /**
   * Sets the audio track.
   * @param { AudioTrack } track
   * @returns { AudioPlayerService }
   */
  public setAudioTrack(track: AudioTrack): AudioPlayerService {
    this.audioTrack$.next(track);
    return this;
  }

  /**
   * Resets the audio player state.
   * @returns { void }
   */
  public reset(): void {
    this.globalAudioPlayerService.clearCurrentAudioTrack();
    this.currentAudioTime$.next(0);
    this.volume$.next(100);
    this.loaded$.next(false);
    this.muted$.next(false);
    this.onUnregisterActivePlayer();
  }

  /**
   * Plays the audio. Will force sync to the global audio player service if it is not already active.
   * @returns { void }
   */
  public play(): void {
    if (!this.isActivePlayer) {
      this.syncToBackgroundPlayer();
    }
    this.globalAudioPlayerService.play();
    this.trackPlayEvent();
  }

  /**
   * Pauses the audio.
   * @returns { void }
   */
  public pause(): void {
    this.globalAudioPlayerService.pause();
    this.trackPauseEvent();
  }

  /**
   * Seeks to the given time in the audio track.
   * @param { number } seekAudioValue
   * @returns { void }
   */
  public seek(seekAudioValue: number): void {
    if (!this.isActivePlayer) {
      this.currentAudioTime$.next(seekAudioValue);
      this.trackSeekEvent(seekAudioValue);
      return;
    }
    this.globalAudioPlayerService.seek(seekAudioValue);
    this.trackSeekEvent(seekAudioValue);
  }

  /**
   * Skips back by the given duration.
   * @param { number } duration - The duration to skip back by.
   * @returns { void }
   */
  public skipBack(duration: number = 10): void {
    let newTime: number = this.currentAudioTime$.getValue() - duration;

    if (newTime < 0) {
      newTime = 0;
    }

    if (!this.isActivePlayer) {
      this.currentAudioTime$.next(newTime);
      this.trackSeekEvent(newTime);
      return;
    }
    this.globalAudioPlayerService.skipBack(duration);
    this.trackSeekEvent(newTime);
  }

  /**
   * Skips forward by the given duration.
   * @param { number } duration - The duration to skip forward by.
   * @returns { void }
   */
  public skipForward(duration: number = 10): void {
    const newTime: number = this.currentAudioTime$.getValue() + duration;
    if (!this.isActivePlayer) {
      this.currentAudioTime$.next(newTime);
      this.trackSeekEvent(newTime);
      return;
    }
    this.globalAudioPlayerService.skipForward(duration);
    this.trackSeekEvent(newTime);
  }

  /**
   * Sets the volume (value between 0 and 100).
   * @param { number } volumeValue - The volume value to set (between 0 and 100).
   * @returns { void }
   */
  public setVolume(volumeValue: number): void {
    if (!this.isActivePlayer) {
      this.volume$.next(volumeValue);
      return;
    }
    this.globalAudioPlayerService.setVolume(volumeValue);
  }

  /**
   * Mutes the audio.
   * @returns { void }
   */
  public mute(): void {
    if (!this.isActivePlayer) {
      this.muted$.next(true);
      return;
    }
    this.globalAudioPlayerService.mute();
  }

  /**
   * Unmutes the audio.
   * @returns { void }
   */
  public unmute(): void {
    if (!this.isActivePlayer) {
      this.muted$.next(false);
      return;
    }
    this.globalAudioPlayerService.unmute();
  }

  /**
   * Toggles the mute state.
   * @returns { void }
   */
  public toggleMute(): void {
    if (this.muted$.getValue()) {
      this.unmute();
      return;
    }
    this.mute();
  }

  /**
   * Sets the analytics entity.
   * @param { ContextualizableEntity } entity
   * @returns { void }
   */
  public setAnalyticsEntity(entity: ContextualizableEntity): void {
    this.audioPlayerAnalyticsService.init(entity);
  }

  /**
   * Syncs this audio player service to the global audio player service.
   * @returns { void }
   */
  private syncToBackgroundPlayer(): void {
    this.registerActivePlayer();
    this.syncTrack();
    this.syncVolume();
    this.syncMuted();
    this.syncCurrentAudioTime();
  }

  /**
   * Syncs the volume to the global audio player service.
   * @returns { void }
   */
  private syncVolume(): void {
    this.globalAudioPlayerService.setVolume(this.volume$.getValue());
  }

  /**
   * Syncs the muted state to the global audio player service.
   * @returns { void }
   */
  private syncMuted(): void {
    if (this.muted$.getValue()) {
      this.globalAudioPlayerService.mute();
    } else {
      this.globalAudioPlayerService.unmute();
    }
  }

  /**
   * Syncs the current audio time to the global audio player service.
   * @returns { void }
   */
  private syncCurrentAudioTime(): void {
    this.globalAudioPlayerService.seek(this.currentAudioTime$.getValue());
  }

  /**
   * Syncs the audio track to the global audio player service.
   * @returns { void }
   */
  private syncTrack(): void {
    this.globalAudioPlayerService.loadTrack(this.audioTrack$.getValue());
  }

  /**
   * Tracks the seek event.
   * @param { number } seekTime - The time to seek to.
   * @returns { void }
   */
  private trackSeekEvent(seekTime: number): void {
    this.audioPlayerAnalyticsService.trackSeekEvent({
      audio_time: seekTime,
      audio_duration: this.audioTrack$.getValue().duration,
      audio_volume: this.volume$.getValue(),
      audio_muted: this.muted$.getValue(),
      audio_playing: this.playing$.getValue(),
    });
  }

  /**
   * Tracks the play event.
   * @returns { void }
   */
  private trackPlayEvent(): void {
    this.audioPlayerAnalyticsService.trackPlayEvent({
      audio_time: this.currentAudioTime$.getValue(),
      audio_duration: this.audioTrack$.getValue().duration,
      audio_volume: this.volume$.getValue(),
      audio_muted: this.muted$.getValue(),
    });
  }

  /**
   * Tracks the pause event.
   * @returns { void }
   */
  private trackPauseEvent(): void {
    this.audioPlayerAnalyticsService.trackPauseEvent({
      audio_time: this.currentAudioTime$.getValue(),
      audio_duration: this.audioTrack$.getValue()?.duration,
      audio_volume: this.volume$.getValue(),
      audio_muted: this.muted$.getValue(),
    });
  }
}
