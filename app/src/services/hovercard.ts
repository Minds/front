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

  constructor(public client: Client, public cache: CacheService) {
  }

  show(guid: any, anchor: any) {
    if (!guid) {
      return;
    }

    this.setAnchor(anchor);

    if (this.guid == guid) {
      return;
    }

    this.guid = guid;
    this.shown = true;
    this.sticky = false;

    let data = this.cache.get(`hovercard-${this.guid}`);

    if (data === false) {
      // Still fetching
      return;
    } else if (data) {
      this.data = data;
      return;
    }

    this.cache.set(`hovercard-${this.guid}`, false);

    this.client.get(`api/v1/entities/entity/${this.guid}`, {})
    .then((response: any) => {
      if (response.entity) {
        this.cache.set(`hovercard-${this.guid}`, response.entity);

        if (this.guid == response.entity.guid) {
          this.data = response.entity;
        }
      } else {
        this.cache.set(`hovercard-${this.guid}`, undefined);
      }
    })
    .catch(e => {
      this.cache.set(`hovercard-${this.guid}`, undefined);
    });
  }

  hide(guid: any) {
    if (this.guid != guid || this.sticky) {
      return;
    }

    this.guid = '';
    this.shown = false;
    this.data = null;
  }

  setAnchor(elem: any) {
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
      top = rect.top + window.pageYOffset - doc.clientTop,
      left = rect.left + window.pageXOffset - doc.clientLeft,
      right = left + rect.width,
      bottom = top + rect.height;

    this.anchor.right = 'auto';
    this.anchor.bottom = 'auto';
    this.anchor.top = top;
    this.anchor.left = right + 4;
  }
}
