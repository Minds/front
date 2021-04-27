import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../../services/api';

@Injectable()
export class CardCarouselService {
  searchCards$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private client: Client) {}

  async search(q: string = ''): Promise<void> {
    if (!q) return;
    this.error$.next(null);
    this.inProgress$.next(true);

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

      this.searchCards$.next(entities);
    } catch (e) {
      console.error(e);
      this.error$.next(e.message);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
