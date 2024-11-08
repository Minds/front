/** Audio track type. */
export type AudioTrack = {
  src: string;
  duration: number;
};

/** Generic audio analytics event type. */
export type GenericAudioAnalyticsEvent = {
  audio_time: number;
  audio_duration: number;
  audio_volume: number;
  audio_muted: boolean;
};

/** Audio play analytics event type. */
export type AudioPlayAnalyticsEvent = GenericAudioAnalyticsEvent;

/** Audio pause analytics event type. */
export type AudioPauseAnalyticsEvent = GenericAudioAnalyticsEvent;

/** Audio seek analytics event type. */
export type AudioSeekAnalyticsEvent = {
  audio_playing: boolean;
} & GenericAudioAnalyticsEvent;

/** Audio playback state. */
export enum AudioPlaybackState {
  LOADING,
  PLAYING,
  PAUSED,
}
