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

@Injectable()
export class SuggestionsService {
  protected mechanism: Mechanism = 'graph';

  protected suggestions: Array<Suggestion> | null = null;

  constructor(
    protected client: Client,
    protected storage: Storage,
    protected entities: EntitiesService
  ) {}

  setMechanism(mechanism: Mechanism): SuggestionsService {
    this.mechanism = mechanism;
    this.suggestions = null;
    return this;
  }

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

  isHidden(guid): boolean {
    return Boolean(this.storage.get(`user:suggestion:${guid}:removed`));
  }

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
            limit: 500,
            all: 0,
            hashtag: '',
            hashtags: '',
            sync: false,
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
