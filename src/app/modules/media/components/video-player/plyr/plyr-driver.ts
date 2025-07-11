/**
 * Forked from https://github.com/smnbbrv/ngx-plyr/tree/master
 * @license MIT
 */
import type * as Plyr from 'plyr';

export interface PlyrDriverCreateParams {
  options: Plyr.Options;
  videoElement: HTMLVideoElement;
}

export interface PlyrDriverUpdateSourceParams {
  plyr: Plyr;
  source: Plyr.SourceInfo;
  videoElement: HTMLVideoElement;
}

export interface PlyrDriverDestroyParams {
  plyr: Plyr;
}

export interface PlyrDriver {
  create(params: PlyrDriverCreateParams): Plyr;
  updateSource(params: PlyrDriverUpdateSourceParams): void;
  destroy(params: PlyrDriverDestroyParams): void;
}
