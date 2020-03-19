import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';

@Injectable()
export class ChannelSuggestionsService {
  error$: BehaviorSubject<string> = new BehaviorSubject(null);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  suggestions$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  lastOffset: number = 0;

  constructor(private client: Client, private storage: Storage) {}

  async load(opts: { limit: number; refresh: boolean }) {
    this.error$.next(null);
    this.inProgress$.next(true);

    if (opts.refresh) {
      this.suggestions$.next([]);
    }

    // Subscribe can not rely on next batch, so load further batch
    this.lastOffset = this.suggestions$.getValue().length
      ? this.lastOffset + 11
      : 0;

    try {
      const response: any = await this.client.get('api/v2/suggestions/user', {
        limit: opts.limit,
        offset: this.lastOffset,
      });
      for (let suggestion of response.suggestions) {
        const removed = this.storage.get(
          `user:suggestion:${suggestion.entity_guid}:removed`
        );
        if (!removed) {
          this.suggestions$.next([...this.suggestions$.getValue(), suggestion]);
        }
      }
    } catch (err) {
      this.error$.next(err.message);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
