import { ApiResponse, ApiService } from './../../../common/api/api.service';
import { RecentSubscriptionsService } from './../../../common/services/recent-subscriptions.service';
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
    private api: ApiService,
    private storage: Storage,
    private recentSubscriptions: RecentSubscriptionsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async load(opts: {
    limit: number;
    refresh: boolean;
    type: string;
    user?: string;
  }) {
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
      let suggestions = [];
      if (opts.user) {
        const response = await this.api
          .get('api/v3/recommendations', {
            location: 'channel',
            mostRecentSubscriptions: this.recentSubscriptions.list(),
            currentChannelUserGuid: opts.user,
            limit: opts.limit,
          })
          .toPromise();
        suggestions = response.entities;
      } else {
        if (opts.type === 'user') {
          const response = await this.api
            .get(
              'api/v3/subscriptions/relational/subscriptions-of-subscriptions',
              {
                limit: opts.limit,
                offset: this.lastOffset,
              }
            )
            .toPromise();
          suggestions = response.users.map(user => {
            return {
              entity: user,
            };
          });
        } else {
          // Groups
          const response: any = await this.client.get(
            `api/v2/suggestions/${opts.type}`,
            {
              limit: opts.limit,
              offset: this.lastOffset,
            }
          );
          suggestions = response.suggestions;
        }
      }

      for (let suggestion of suggestions) {
        const removed = this.storage.get(
          `suggestion:${suggestion.entity_guid}:removed`
        );
        if (!removed) {
          this.suggestions$.next([...this.suggestions$.getValue(), suggestion]);
        }
      }
      if (opts.user) {
        // contextual publisher recommendations doesn't support pagination
        this.hasMoreData$.next(false);
      } else {
        this.hasMoreData$.next(suggestions.length >= opts.limit);
      }
    } catch (err) {
      this.error$.next(err.message);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
