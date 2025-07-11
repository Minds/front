/**
 * Forked from https://github.com/smnbbrv/ngx-plyr/tree/master
 * @license MIT
 */
import Plyr from 'plyr';
import {
  PlyrDriver,
  PlyrDriverCreateParams,
  PlyrDriverDestroyParams,
  PlyrDriverUpdateSourceParams,
} from './plyr-driver';

export class DefaultPlyrDriver implements PlyrDriver {
  create(params: PlyrDriverCreateParams) {
    return new Plyr(params.videoElement, params.options);
  }

  updateSource(params: PlyrDriverUpdateSourceParams) {
    params.plyr.source = params.source;
  }

  destroy(params: PlyrDriverDestroyParams) {
    params.plyr.destroy();
  }
}
