import {
  PlyrDriver,
  PlyrDriverCreateParams,
  PlyrDriverDestroyParams,
  PlyrDriverUpdateSourceParams,
} from '@bhayward93/ngx-plyr';
import * as Plyr from 'plyr';
import { Subject } from 'rxjs';

export class HlsjsPlyrDriver implements PlyrDriver {
  /**
   * HLS library
   */
  hls;

  /**
   * Reference of the plyr object we have created/are dealing with
   */
  plyr: Plyr;

  /**
   * If the source is loaded or not
   */
  private loaded = false;

  /** */
  availableQualities$: Subject<number[]> = new Subject();

  constructor(private autoload: boolean) {
    const Hls = require('hls.js');
    this.hls = new Hls();
  }

  create(params: PlyrDriverCreateParams) {
    this.hls.attachMedia(params.videoElement);

    this.plyr = new Plyr(params.videoElement, params.options);
    return this.plyr;
  }

  updateSource(params: PlyrDriverUpdateSourceParams) {
    if (this.autoload) {
      this.load(params.source.sources[0].src);
    } else {
      // poster does not work with autoload
      params.videoElement.poster = params.source.poster;
    }
  }

  destroy(params: PlyrDriverDestroyParams) {
    params.plyr.destroy();
    this.hls.detachMedia();
    this.hls.destroy();
    this.loaded = false;
  }

  load(src: string) {
    if (!this.loaded && src) {
      this.loaded = true;
      this.hls.loadSource(src);

      // this.hls.on('hlsMediaAttaching', e => {
      //   console.log(e);
      // });

      // this.hls.on(hls.Events.MANIFEST_PARSED, () => {
      //   var availableQualities = this.hls.levels.map(l => l.height);

      //   this.availableQualities$.next(availableQualities);
      // });
    }
  }
}
