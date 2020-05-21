import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class SuggestionsService {
  error$: BehaviorSubject<string> = new BehaviorSubject(null);
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  suggestions$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  hasMoreData$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  lastOffset: number = 0;

  constructor(
    private client: Client,
    private storage: Storage,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async load(opts: { limit: number; refresh: boolean; type: string }) {
    this.error$.next(null);
    this.inProgress$.next(true);

    if (isPlatformServer(this.platformId)) return;

    if (opts.refresh) {
      this.suggestions$.next([]);
    }

    // Subscribe can not rely on next batch, so load further batch
    this.lastOffset = this.suggestions$.getValue().length
      ? this.lastOffset + opts.limit
      : 0;

    try {
      const response: any = await this.client.get(
        `api/v2/suggestions/${opts.type}`,
        {
          limit: opts.limit,
          offset: this.lastOffset,
        }
      );
      for (let suggestion of response.suggestions) {
        const removed = this.storage.get(
          `suggestion:${suggestion.entity_guid}:removed`
        );
        if (!removed) {
          this.suggestions$.next([...this.suggestions$.getValue(), suggestion]);
        }
      }
      this.hasMoreData$.next(response.suggestions.length >= opts.limit);
    } catch (err) {
      this.error$.next(err.message);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
