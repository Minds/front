/**
 * We should replace many of these types with native ones when
 * video.js offers typing support for our current version.
 */
export type VideoJSCustomMetadata = {
  videoHeight: number;
  videoWidth: number;
};

// https://videojs.com/guides/options/#autoplay
export type VideoJSCustomAutoplayValue =
  | true
  | false
  | 'muted'
  | 'play'
  | 'any';

export type VideoJSCustomOptions = Partial<{
  fluid: boolean; // dynamic aspect ratio.
  aspectRatio: string; // aspect ratio for video.
  autoplay: boolean; // whether autoplay should be enabled.
  sources: {
    src: string;
    type: string;
  }[]; // sources for player.
  poster: string; // poster to display on video before play.
  muted: VideoJSCustomAutoplayValue; // player muted state.
  liveui: boolean; // enables v2 livestream UI.
}>;
