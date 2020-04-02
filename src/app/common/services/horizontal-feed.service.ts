import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../services/api/client';
import { EntitiesService } from './entities.service';

/**
 * Specifies how to interpret base entity and which correlation to use
 */
export type HorizontalFeedContext = 'container';

/**
 * Specifies the object returned to consumers
 */
export interface HorizontalFeedObject {
  index: number;
  entity: BehaviorSubject<any>;
}

/**
 * Response from navigational methods
 */
export type HorizontalFeedResponse = HorizontalFeedObject | null;

/**
 * Stores per-side pools and its attributes for the base entity
 */
interface HorizontalFeedPool {
  entities: any[];
  moreData: boolean;
  offset?: any;
}

/**
 * Horizontal feed pools
 */
interface HorizontalFeedPools {
  prev: HorizontalFeedPool;
  next: HorizontalFeedPool;
}

/**
 * Change event payload
 */
interface HorizontalFeedChange {
  context: HorizontalFeedContext;
  cursor: number;
  lastUpdate: number;
}

/**
 * This service allow retrieving entities to navigate through a horizontal feed whose entities will be loaded
 * one by one in specialized components.
 *
 * @todo: Support other kind of contexts
 */
@Injectable()
export class HorizontalFeedService {
  protected context: HorizontalFeedContext;

  protected baseEntity: any;

  protected limit: number = 600;

  protected cursor: number = 0;

  protected pools: HorizontalFeedPools = {
    next: {
      entities: [],
      moreData: true,
    },
    prev: {
      entities: [],
      moreData: true,
    },
  };

  protected onChangeEmitter: EventEmitter<
    HorizontalFeedChange
  > = new EventEmitter<HorizontalFeedChange>();

  constructor(protected client: Client, protected entities: EntitiesService) {}

  /**
   * Sets the current context and resets
   * @param context
   */
  setContext(context: HorizontalFeedContext): HorizontalFeedService {
    this.context = context;
    this.reset();
    return this;
  }

  /**
   * Sets the base entity and resets
   * @param entity
   */
  setBaseEntity(entity: any): HorizontalFeedService {
    this.baseEntity = entity;
    this.reset();
    return this;
  }

  /**
   * Sets the total limit of entities per-side
   * @param limit
   */
  setLimit(limit: number): HorizontalFeedService {
    this.limit = limit;
    return this;
  }

  /**
   * Reset the cursor and caches
   */
  reset(): HorizontalFeedService {
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
  async go(index: number): Promise<HorizontalFeedResponse> {
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
  prev(): Promise<HorizontalFeedResponse> {
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
  next(): Promise<HorizontalFeedResponse> {
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
  onChange(): EventEmitter<HorizontalFeedChange> {
    return this.onChangeEmitter;
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
        throw new Error('Unknown Horizontal Feed context');
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
    const endpoint = `api/v2/feeds/container/${guid}/all`;

    const params = {
      sync: 1,
      force_public: 1,
      limit: this.limit,
      from_timestamp: baseEntityTimestamp,
    };

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

    const baseGuids = [
      this.baseEntity.guid,
      this.baseEntity.entity_guid,
      this.baseEntity.remind_object && this.baseEntity.remind_object.guid,
      this.baseEntity.remind_object &&
        this.baseEntity.remind_object.entity_guid,
    ].filter(Boolean);

    let changed = false;

    if (prev !== null) {
      this.pools.prev = {
        entities: prev.filter(
          entity => entity.guid && !baseGuids.includes(entity.guid)
        ),
        moreData: false,
      };

      changed = true;
    }

    if (next !== null) {
      this.pools.next = {
        entities: next.filter(
          entity => entity.guid && !baseGuids.includes(entity.guid)
        ),
        moreData: false,
      };

      changed = true;
    }

    if (changed) {
      this._emitChange();
    }
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

    if (!response || !response.entities || !response.entities.length) {
      return [];
    }

    return response.entities;
  }
}
