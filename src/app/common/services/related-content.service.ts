import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivityEntity } from '../../modules/newsfeed/activity/activity.service';
import { Client } from '../../services/api/client';
import { EntitiesService } from './entities.service';
import getActivityContentType from '../../helpers/activity-content-type';

/**
 * Specifies how to interpret base entity and which correlation to use
 *
 * Container can be a user or group
 */
export type RelatedContentContext = 'container';

/**
 * Specifies the parent component
 *
 * Currently only activityModal has an effect
 */
export type RelatedContentParent = 'activityModal' | '';

/**
 * Specifies the object returned to consumers
 */
export interface RelatedContentObject {
  index: number;
  entity: BehaviorSubject<any>;
}

/**
 * Response from navigational methods
 */
export type RelatedContentResponse = RelatedContentObject | null;

/**
 * Stores per-side pools and its attributes for the base entity
 */
export interface RelatedContentPool {
  entities: any[];
  moreData: boolean;
  offset?: any;
}

/**
 * Related content pools
 */
export interface RelatedContentPools {
  prev: RelatedContentPool;
  next: RelatedContentPool;
}

/**
 * Change event payload
 */
interface RelatedContentChange {
  context: RelatedContentContext;
  cursor: number;
  lastUpdate: number;
}

/**
 * Types of filter for feed, appended to end of v2/feeds/container URL.
 * 'activities' returns images, videos and blogs
 */
type FilterType = 'all' | 'videos' | 'activities';

/**
 * Default value for filter.
 */
const DEFAULT_FILTER_VALUE = 'activities';

/**
 * This service allow retrieving entities to navigate through a horizontal feed whose entities will be loaded
 * one by one in specialized components.
 *
 * @todo: Support other kind of contexts
 */
@Injectable()
export class RelatedContentService {
  protected context: RelatedContentContext;

  protected baseEntity: any;

  protected limit: number = 600;

  protected cursor: number = 0;

  protected parent: RelatedContentParent;

  public pools: RelatedContentPools = {
    next: {
      entities: [],
      moreData: true,
    },
    prev: {
      entities: [],
      moreData: true,
    },
  };

  protected onChangeEmitter: EventEmitter<RelatedContentChange> =
    new EventEmitter<RelatedContentChange>();

  constructor(
    protected client: Client,
    protected entities: EntitiesService
  ) {}

  /**
   * Filter the feed by filter type.
   */
  private filter: FilterType = DEFAULT_FILTER_VALUE;

  /**
   * Sets parent component context
   * */
  setParent(parent: RelatedContentParent): RelatedContentService {
    this.parent = parent;
    return this;
  }

  /**
   * Sets the current context and resets
   * @param context
   */
  setContext(context: RelatedContentContext): RelatedContentService {
    this.context = context;
    this.reset();
    return this;
  }

  /**
   * Gets Base Entity
   * @returns entity
   */
  getBaseEntity(): any {
    return this.baseEntity;
  }

  /**
   * Sets the base entity and resets
   * @param entity
   */
  setBaseEntity(entity: any): RelatedContentService {
    this.baseEntity = entity;
    this.reset();
    return this;
  }

  /**
   * Sets the total limit of entities per-side
   * @param limit
   */
  setLimit(limit: number): RelatedContentService {
    this.limit = limit;
    return this;
  }

  /**
   * Sets filter to set class to request specific content types.
   * @param { FilterType } filter - entity type to be returned by fetch.
   */
  setFilter(filter: FilterType): RelatedContentService {
    this.filter = filter;
    return this;
  }

  /**
   * Reset the cursor and caches
   */
  reset(): RelatedContentService {
    this.cursor = 0;

    this.pools = {
      next: {
        entities: [],
        moreData: true,
      },
      prev: {
        entities: [],
        moreData: true,
      },
    };

    if (this.context) {
      this._emitChange();
    }

    return this;
  }

  /**
   * Moves the cursor to a certain point and retrieves the entity, if exists
   * @param index
   */
  async go(index: number): Promise<RelatedContentResponse> {
    await this.fetch();

    if (!(await this.has(index))) {
      return null;
    }

    this.cursor = index;

    this._emitChange();

    if (index === 0) {
      return {
        index,
        entity: new BehaviorSubject(this.baseEntity),
      };
    }

    const entities =
      index < 0 ? this.pools.prev.entities : this.pools.next.entities;

    const entity = entities[Math.abs(index) - 1] || null;

    if (entity && entity.entity) {
      // Already hydrated, but clients would expect a subject

      return {
        index,
        entity: new BehaviorSubject(entity.entity),
      };
    }

    // Returns entities service subject

    return {
      index: index,
      entity: this.entities.single(entity.urn),
    };
  }

  /**
   * Checks if the index is within bounds and exists
   * @param index
   * @param lazy
   */
  async has(index: number, lazy: boolean = false): Promise<boolean> {
    if (!lazy) {
      await this.fetch();
    }

    if (!this.baseEntity) {
      return false;
    } else if (index === 0) {
      return Boolean(this.baseEntity);
    } else if (Math.abs(index) < this.limit) {
      const entities =
        index < 0 ? this.pools.prev.entities : this.pools.next.entities;

      return typeof entities[Math.abs(index) - 1] !== 'undefined';
    }

    return false;
  }

  /**
   * Shortcut for go(index - 1)
   */
  prev(): Promise<RelatedContentResponse> {
    return this.go(this.cursor - 1);
  }

  /**
   * Shortcut for has(index - 1, lazy)
   * @param lazy
   */
  hasPrev(lazy: boolean = false): Promise<boolean> {
    return this.has(this.cursor - 1, lazy);
  }

  /**
   * Shortcut for go(index + 1)
   */
  next(): Promise<RelatedContentResponse> {
    return this.go(this.cursor + 1);
  }

  /**
   * Shortcut for has(index + 1, lazy)
   * @param lazy
   */
  hasNext(lazy: boolean = false): Promise<boolean> {
    return this.has(this.cursor + 1, lazy);
  }

  /**
   * Returns an event emitter that will fire an event when something (cursor, pools) change
   */
  onChange(): EventEmitter<RelatedContentChange> {
    return this.onChangeEmitter;
  }

  /**
   * Gets next fetched entity.
   * @returns { ActivityEntity } - next fetched entity.
   */
  getNextEntity(): ActivityEntity {
    try {
      const index = this.cursor + 1;

      if (index === 0) {
        return this.baseEntity;
      }

      const entities =
        index < 0 ? this.pools.prev.entities : this.pools.next.entities;

      const entity = entities[Math.abs(index) - 1] || null;

      return entity.entity;
    } catch (e) {
      return null;
    }
  }

  /**
   * Internal method that fires a change event
   * @private
   */
  protected _emitChange(): void {
    this.onChangeEmitter.next({
      context: this.context,
      cursor: this.cursor,
      lastUpdate: +Date.now(),
    });
  }

  /**
   * Fetches based on context and entity, if necessary
   */
  async fetch(): Promise<void> {
    // If no base entity, just reset pools

    if (!this.baseEntity) {
      this.pools = {
        next: {
          entities: [],
          moreData: false,
        },
        prev: {
          entities: [],
          moreData: false,
        },
      };

      return;
    }

    // Context-based operations

    switch (this.context) {
      case 'container':
        await this._fetchContainer();
        break;

      default:
        throw new Error('Unknown related content context');
    }
  }

  /**
   * Fetches based on chronological neighbors for a container (user/group)
   * @private
   */
  protected async _fetchContainer() {
    const baseEntity = this.baseEntity;
    const baseEntityTimestamp = baseEntity.time_created * 1000;
    const guid = baseEntity.container_guid || baseEntity.owner_guid;

    const filter = this.filter ? this.filter : 'activities';
    const endpoint = `api/v2/feeds/container/${guid}/${filter}`;

    const params = {
      sync: 1,
      force_public: 1,
      limit: this.limit,
      from_timestamp: baseEntityTimestamp,
    };

    // Create pools if they exist
    // TODO: Make this less convoluted
    const [prev, next] = await Promise.all([
      this.pools.prev.moreData
        ? this._fetchFromServer(endpoint, {
            ...params,
            reverse_sort: 1,
          })
        : Promise.resolve(null),
      this.pools.next.moreData
        ? this._fetchFromServer(endpoint, params)
        : Promise.resolve(null),
    ]);

    let changed = false;

    if (prev !== null) {
      this.pools.prev = {
        entities: this._removeDuplicates(prev),
        moreData: false,
      };

      changed = true;
    }

    if (next !== null) {
      this.pools.next = {
        entities: this._removeDuplicates(next),
        moreData: false,
      };

      changed = true;
    }

    if (changed) {
      this._emitChange();
    }
  }

  protected _removeDuplicates(entities): Array<any> {
    const baseRemind = this.baseEntity.remind_object || null;

    const baseGuids = [
      this.baseEntity.guid,
      this.baseEntity.entity_guid,
      baseRemind && baseRemind.guid ? baseRemind.guid : false,
      baseRemind && baseRemind.entity_guid ? baseRemind.entity_guid : false,
    ].filter(Boolean);

    const uniqueEntities = entities.filter((entity) => {
      let duplicateGuid,
        duplicateEntityGuid = true;

      if (entity && entity.guid) {
        duplicateGuid = baseGuids.includes(entity.guid);

        if (entity.entity) {
          duplicateEntityGuid = baseGuids.includes(entity.entity.entity_guid);
        }
      }

      if (!duplicateGuid && !duplicateEntityGuid) {
        return entity;
      }
    });

    return uniqueEntities;
  }

  /**
   * Internal method to fetch /feeds endpoints
   * @param endpoint
   * @param params
   * @private
   */
  protected async _fetchFromServer(
    endpoint: string,
    params: any
  ): Promise<any[]> {
    const response = (await this.client.get(endpoint, params, {
      cache: true,
    })) as any;

    // if video only feed, return
    if (this.filter === 'videos') {
      return response.entities.length ? response.entities : [];
    }

    if (response && response.entities && response.entities.length) {
      // For activity modal pager, filter out all except images and vids
      if (this.parent === 'activityModal') {
        const filteredResponse = response.entities.filter(
          (e) =>
            e.entity &&
            // Must be an activity
            (e.entity.entity_guid || e.entity.message) &&
            // Only images and videos
            (getActivityContentType(e.entity) === 'image' ||
              getActivityContentType(e.entity) === 'video')
        );

        if (filteredResponse.length) {
          return filteredResponse;
        }
      } else {
        // Else, don't return quotes, reminds or non-activities
        response.entities.filter(
          (e) =>
            e.entity &&
            (e.entity.entity_guid || e.entity.message) &&
            !e.entity.remind_object
        );

        if (response.entities.length) {
          return response.entities;
        }
      }
    }

    return [];
  }
}
