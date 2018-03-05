import { Injectable } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';

import { Storage } from './storage';

import { Subscription } from 'rxjs/Subscription';
import { Client } from './api/client';

export type ContextServiceProduct =
  'activity' |
  'user' |
  'object:video' |
  'object:image' |
  'object:blog' |
  'group';

export type ContextServiceEntity = { label: string, id: any, nameLabel?: string };

export type ContextServiceResponse = { product: ContextServiceProduct, label: string, entity?: ContextServiceEntity };

@Injectable()
export class ContextService {

  context: ContextServiceResponse | null;

  private _routerListener: Subscription;

  constructor(private router: Router, private storage: Storage, private client: Client) { }

  static _(router: Router, storage: Storage, client: Client) {
    return new ContextService(router, storage, client);
  }

  listen() {
    this._routerListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.reset();
      }
    });

    return this;
  }

  unlisten(): this {
    this._routerListener.unsubscribe();

    return this;
  }

  reset() {
    this.context = null;
  }

  set(product: ContextServiceProduct, entity?: ContextServiceEntity) {
    let label: string = this.getProductLabel(product) || product;

    this.context = { product, label, entity };

    if (entity && entity.nameLabel) {
      this._storeLabel(entity.id, entity.nameLabel);
    }
  }

  get(): ContextServiceResponse | null {
    return this.context;
  }

  getProductLabel(product: string) {
    let label = '';

    switch (product) {
      case 'activity':
        label = 'posts';
        break;

      case 'user':
        label = 'channels';
        break;

      case 'object:video':
        label = 'videos';
        break;

      case 'object:image':
        label = 'images';
        break;

      case 'object:blog':
        label = 'blogs';
        break;

      case 'group':
        label = 'groups';
        break;
    }

    return label;
  }

  // Context name label resolution

  resolveLabel(guid: string): Promise<string> {
    const cache = this._fetchLabel(guid);

    if (cache !== null) {
      return Promise.resolve(cache);
    }

    return this.client.get(`api/v1/entities/entity/${guid}`)
      .then((response: any) => {
        if (!response || !response.entity) {
          return '';
        }

        let label = '';

        if (response.entity.username) {
          label = `@${response.entity.username}`;
        } else if (response.entity.name) {
          label = response.entity.name;
        }

        this._storeLabel(guid, label);

        return label;
      });
  }

  resolveStaticLabel(product: string): Promise<string> {
    return Promise.resolve(this.getProductLabel(product) || 'Minds');
  }

  protected _storeLabel(guid: string, label: string) {
    const cache = JSON.parse(this.storage.get('context-label-cache') || `{}`);

    cache[guid] = label;

    this.storage.set('context-label-cache', JSON.stringify(cache));
  }

  protected _fetchLabel(guid: string): string | null {
    const cache = JSON.parse(this.storage.get('context-label-cache') || `{}`);

    if (typeof cache[guid] !== 'undefined') {
      return cache[guid];
    }

    return null;
  }
}
