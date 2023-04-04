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
