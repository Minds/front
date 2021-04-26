import { Injectable } from '@angular/core';
import { Client } from '../../../services/api';

@Injectable()
export class CardCarouselService {
  constructor(private client: Client) {}

  async fetchSearch(q: string = ''): Promise<any> {
    if (!q) return;

    const opts = {
      q: q,
      period: 'relevant',
      algorithm: 'channels',
      type: 'all',
      limit: 12,
      sync: 1,
      plus: false,
    };

    try {
      const { entities } = <any>(
        await this.client.get('api/v3/discovery/search', opts)
      );
      return entities;
    } catch (e) {
      console.error(e);
    }
  }
}
