import { Client } from './api';
import { CacheService } from './cache';

export class HovercardService {
  shown: boolean = false;
  guid: any = '';
  data: any = null;

  anchor: any = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  };

  sticky: boolean = false;

  static _(client: Client, cache: CacheService) {
    return new HovercardService(client, cache);
  }

  constructor(public client: Client, public cache: CacheService) {
  }

  show(guid: any, elem: any, anchor: any) {
    if (!guid) {
      return;
    }

    this.shown = true;
    this.unstick();
    this.setAnchor(elem, anchor);

    if (this.guid === guid) {
      return;
    }

    this.guid = guid;

    let data = this.cache.get(`hovercard-${this.guid}`);

    if (data === false) {
      // Still fetching
      return;
    } else if (data) {
      this.data = data;
      return;
    }

    this.cache.set(`hovercard-${this.guid}`, false);

    let currentGuid = this.guid; // Cache parameter scoping (`this` might change)
    this.client.get(`api/v1/entities/entity/${this.guid}`, {})
      .then((response: any) => {
        if (response.entity) {
          this.cache.set(`hovercard-${currentGuid}`, response.entity);

          if (this.guid === response.entity.guid) {
            this.data = response.entity;
          }
        } else {
          this.cache.set(`hovercard-${currentGuid}`, undefined);
        }
      })
      .catch(e => {
        this.cache.set(`hovercard-${currentGuid}`, undefined);
      });
  }

  hide(guid: any) {
    if (this.guid !== guid || this.sticky) {
      return;
    }

    this.guid = '';
    this.shown = false;
    this.data = null;
  }

  stick(guid: any) {
    if (this.guid !== guid) {
      return;
    }

    this.sticky = true;
  }

  unstick() {
    this.sticky = false;
  }

  setAnchor(elem: any, anchor: any) {
    if (!elem.getClientRects().length) {
      // dettached DOM element
      return;
    }

    let rect = elem.getBoundingClientRect();

    if (!rect.width && !rect.height) {
      // display: none
      return;
    }

    let doc = elem.ownerDocument.documentElement,
      docW = doc.clientWidth,
      docH = doc.clientHeight,
      top = rect.top + window.pageYOffset - doc.clientTop,
      left = rect.left + window.pageXOffset - doc.clientLeft,
      right = left + rect.width,
      bottom = top + rect.height,
      yPadding = 4;

    if (anchor.indexOf('left') !== -1) {
      this.anchor.left = 'auto';
      this.anchor.right = docW - left + yPadding;
    } else { // right: default
      this.anchor.right = 'auto';
      this.anchor.left = right + yPadding;
    }

    if (anchor.indexOf('bottom') !== -1) {
      this.anchor.top = 'auto';
      this.anchor.bottom = docH - top - rect.height;
    } else { // top: default
      this.anchor.bottom = 'auto';
      this.anchor.top = top;
    }
  }

}
