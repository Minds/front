import { Injectable } from '@angular/core';
import { Client } from '../api/client.service';
import { Storage } from '../../services/storage';
import { EntitiesService } from './entities.service';
import { BehaviorSubject } from 'rxjs';

export type Mechanism = 'graph' | 'top';

export interface Suggestion {
  entity_guid: string;
  entity_type: string;
  entity: BehaviorSubject<any> | Promise<any> | null;
  confidence_score?: number;
}

interface GetOptions {
  limit: number;
  offset?: number;
}

/**
 * Service
 */
@Injectable()
export class SuggestionsService {
  protected mechanism: Mechanism = 'graph';

  protected suggestions: Array<Suggestion> | null = null;

  constructor(
    protected client: Client,
    protected storage: Storage,
    protected entities: EntitiesService
  ) {}

  /**
   * Changes the mechanism and resets suggestion cache
   * @param mechanism
   */
  setMechanism(mechanism: Mechanism): SuggestionsService {
    this.mechanism = mechanism;
    this.suggestions = null;
    return this;
  }

  /**
   * Gets a list of suggestions, based on the limit and offset values. It will first fetch a
   * large collection from the server based on the set mechanism and normalize the results.
   * Suggestion entities are asynchronous objects meant to be rendered using the `| async` pipe.
   *
   * @param limit
   * @param offset
   */
  async get({ limit, offset }: GetOptions): Promise<Array<Suggestion>> {
    if (this.suggestions === null || !offset) {
      await this.fetch(this.mechanism);

      if (this.suggestions === null && this.mechanism === 'top') {
        // Only fallback from top to graph
        await this.fetch('graph');
      }
    }

    if (this.suggestions === null) {
      return [];
    }

    offset = offset || 0;

    return this.suggestions.slice(offset, limit + offset).map(suggestion => ({
      ...suggestion,
      entity: suggestion.entity
        ? Promise.resolve(suggestion.entity)
        : this.entities.single(
            `urn:${suggestion.entity_type}:${suggestion.entity_guid}`
          ),
    }));
  }

  /**
   * Checks if a guid should be hidden from the results, based on user
   * manual passing and current subscriptions.
   *
   * @param guid
   */
  isHidden(guid): boolean {
    return Boolean(this.storage.get(`user:suggestion:${guid}:removed`));
  }

  /**
   * Fetches a collection of suggestions from the server and normalizes its
   * results using a common interface.
   *
   * @param mechanism
   */
  protected async fetch(mechanism: Mechanism) {
    switch (mechanism) {
      case 'graph': {
        const response: any = await this.client.get('api/v2/suggestions/user', {
          limit: 100,
          offset: 0,
        });

        if (response && response.suggestions) {
          this.suggestions = [];

          for (let suggestion of response.suggestions) {
            if (!suggestion || this.isHidden(suggestion.entity_guid)) {
              continue;
            }

            this.suggestions.push({
              entity_guid: suggestion.entity_guid,
              entity_type: suggestion.entity_type,
              entity: suggestion.entity,
              confidence_score: suggestion.confidence_score,
            });
          }
        }
        break;
      }

      case 'top': {
        const response: any = await this.client.get(
          'api/v2/feeds/global/top/channels',
          {
            period: '30d',
            limit: 600, // Server's hard limit
            all: 0,
            hashtag: '',
            hashtags: '',
            sync: 1,
            nsfw: '',
          }
        );

        if (response && response.entities) {
          this.suggestions = [];

          for (let feedSyncEntity of response.entities) {
            if (!feedSyncEntity || this.isHidden(feedSyncEntity.guid)) {
              continue;
            }

            this.suggestions.push({
              entity_guid: feedSyncEntity.guid,
              entity_type: 'user',
              entity: feedSyncEntity.entity,
            });
          }
        }
        break;
      }
    }
  }
}
