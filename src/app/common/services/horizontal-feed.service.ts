import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { EntitiesService } from './entities.service';

export type HorizontalFeedContext = 'container';

/**
 * This service allow retrieving entities to navigate through a horizontal feed whose entities will be loaded
 * one by one in specialized components.
 *
 * @todo: RxJS cursor-like get()
 * @todo: Support other kind of context
 */
@Injectable()
export class HorizontalFeedService {
  constructor(protected client: Client, protected entities: EntitiesService) {}

  /**
   * Get the previous and next entity based on an ID and a context.
   *
   * Contexts:
   * - container: Fetch adjacent entities from a container (user/group) sorted chronologically.
   *
   * @param context
   * @param entity
   * @return {Promise}
   */
  async get(
    context: HorizontalFeedContext,
    entity: any
  ): Promise<{ prev; next }> {
    if (!entity) {
      return {
        prev: void 0,
        next: void 0,
      };
    }

    switch (context) {
      case 'container':
        const endpoint = `api/v2/feeds/container/${entity.container_guid ||
          entity.owner_guid}/all`;
        const params = {
          sync: 1,
          as_activities: 1,
          force_public: 1,
          limit: 1,
        };

        return {
          prev: await this.fetch(endpoint, {
            ...params,
            reverse_sort: 1,
            from_timestamp: entity.time_created * 1000 + 1,
          }),
          next: await this.fetch(endpoint, {
            ...params,
            from_timestamp: entity.time_created * 1000 - 1,
          }),
        };

      default:
        throw new Error('Unknown Horizontal Feed context');
    }
  }

  /**
   * Fetch an the first FeedSyncEntity from a /feed endpoint and hydrates it, if necessary.
   * @param endpoint
   * @param params
   * @return {Promise}
   */
  async fetch(endpoint: string, params: any): Promise<any> {
    const response = (await this.client.get(endpoint, params, {
      cache: true,
    })) as any;

    if (!response || !response.entities || !response.entities.length) {
      return void 0;
    }

    const feedSyncEntity = response.entities[0];

    if (feedSyncEntity.entity) {
      return feedSyncEntity.entity;
    }

    return this.entities
      .setCastToActivities(true)
      .single(feedSyncEntity.urn)
      .toPromise();
  }
}
