import { Injectable, OnDestroy } from '@angular/core';
import {
  AnalyticsService,
  ContextualizableEntity,
  SnowplowContext,
} from '../../../../../services/analytics';
import { Subject, Subscription, debounceTime } from 'rxjs';
import {
  AudioPauseAnalyticsEvent,
  AudioPlayAnalyticsEvent,
  AudioSeekAnalyticsEvent,
} from '../types/audio-player.types';

/** Debounce time for seek events. */
const SEEK_EVENT_DEBOUNCE_TIME: number = 2000;

/**
 * Analytics service for the audio player.
 */
@Injectable()
export class AudioPlayerAnalyticsService implements OnDestroy {
  /** The context for the analytics service. */
  private context: SnowplowContext;

  /** The subject for the seek events. - used to debounce to prevent spamming analytics. */
  private readonly trackSeekEvent$: Subject<AudioSeekAnalyticsEvent> =
    new Subject<AudioSeekAnalyticsEvent>();

  /** Subscription to seek events. */
  private readonly trackSeekEventSubscription: Subscription;

  constructor(private analyticsService: AnalyticsService) {
    // Debounce seek events to prevent spamming analytics.
    this.trackSeekEventSubscription = this.trackSeekEvent$
      .pipe(debounceTime(SEEK_EVENT_DEBOUNCE_TIME))
      .subscribe((seekEvent: AudioSeekAnalyticsEvent): void => {
        this.processTrackSeekEvent(seekEvent);
      });
  }

  ngOnDestroy(): void {
    this.trackSeekEventSubscription?.unsubscribe();
  }

  /**
   * Init the service by building the context.
   * @param { ContextualizableEntity } entity - The entity to build the context for.
   * @returns { void }
   */
  public init(entity: ContextualizableEntity): void {
    this.context = this.analyticsService.buildEntityContext(entity);
  }

  /**
   * Track the play event.
   * @param { AudioPlayAnalyticsEvent } event - The play event to track.
   * @returns { void }
   */
  public trackPlayEvent(event: AudioPlayAnalyticsEvent): void {
    this.analyticsService.capture('audio_play', {
      ...this.context?.data,
      ...event,
    });
  }

  /**
   * Track the pause event.
   * @param { AudioPauseAnalyticsEvent } event - The pause event to track.
   * @returns { void }
   */
  public trackPauseEvent(event: AudioPauseAnalyticsEvent): void {
    this.analyticsService.capture('audio_pause', {
      ...this.context?.data,
      ...event,
    });
  }

  /**
   * Track the seek event.
   * @param { AudioSeekAnalyticsEvent } event - The seek event to track.
   * @returns { void }
   */
  public trackSeekEvent(event: AudioSeekAnalyticsEvent): void {
    this.trackSeekEvent$.next(event);
  }

  /**
   * Process seek events (delayed by debounced subject).
   * @param { AudioSeekAnalyticsEvent } event - The seek event to process.
   * @returns { void }
   */
  private processTrackSeekEvent(event: AudioSeekAnalyticsEvent): void {
    this.analyticsService.capture('audio_seek', {
      ...this.context?.data,
      ...event,
    });
  }
}
