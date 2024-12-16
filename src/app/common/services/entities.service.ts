import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Client } from '../../services/api';
import { BlockListService } from './block-list.service';

export type EntityObservable = BehaviorSubject<Object>;
type EntityObservables = Map<string, EntityObservable>;

@Injectable()
export class EntitiesService {
  entities: EntityObservables = new Map<string, EntityObservable>();
  castToActivites: boolean = false;
  exportUserCounts: boolean = false;

  constructor(
    protected client: Client,
    protected blockListService: BlockListService
  ) {}

  async getFromFeed(feed): Promise<EntityObservable[]> {
    if (!feed || !feed.length) {
      return [];
    }

    const urnsToFetch = [];
    const urnsToResync = [];
    const entities = [];

    for (const feedItem of feed) {
      if (feedItem.entity || feedItem.urn) {
        if (feedItem.entity) {
          this.addEntity(feedItem.entity);
        }
        if (!this.entities.has(feedItem.urn)) {
          urnsToFetch.push(feedItem.urn);
        }
        if (
          this.entities.has(feedItem.urn) &&
          !feedItem.entity &&
          feed.length < 20
        ) {
          urnsToResync.push(feedItem.urn);
        }
      }
    }

    // Fetch entities we don't have

    if (urnsToFetch.length) {
      await this.fetch(urnsToFetch);
    }

    // Fetch entities, asynchronously, with no need to wait

    if (urnsToResync.length) {
      this.fetch(urnsToResync);
    }

    for (const feedItem of feed) {
      if (feedItem.entity || feedItem.urn) {
        if (this.entities.has(feedItem.urn)) {
          const entity = this.entities.get(feedItem.urn);
          try {
            if (await entity.pipe(first()).toPromise()) {
              entities.push(entity);
            }
          } catch (err) {}
        }
      } else {
        entities.push(of(feedItem));
      }
    }

    return entities;
  }

  /**
   * Return and fetch a single entity via a urn
   * @param urn string
   * @return Object
   */
  single(urn: string): EntityObservable {
    if (urn.indexOf('urn:') < 0) {
      // not a urn, so treat as a guid
      urn = `urn:activity:${urn}`; // and assume activity
    }

    this.entities.set(urn, new BehaviorSubject(null));

    this.fetch([urn]) // Update in the background
      .then((response: any) => {
        if (!response.entities[0]) {
          return;
        }
        const entity = response.entities[0];

        if (entity && entity.urn !== urn) {
          // urns may differn so fix this
          entity.urn = urn;
          this.addEntity(entity);
        }
      });

    return this.entities.get(urn);
  }

  /**
   * Returns an observable that gets fired twice, once with
   * the cached (in-memory) entity, and another with the newly fetched entity
   * @param urn string
   * @return { Observable }
   */
  singleCacheFirst(urn: string): Observable<EntityObservable> {
    return new Observable((observer) => {
      if (urn.indexOf('urn:') < 0) {
        // not a urn, so treat as a guid
        urn = `urn:activity:${urn}`; // and assume activity
      }

      const existingEntity = this.entities.get(urn);
      if (existingEntity) {
        observer.next(existingEntity);
      }

      this.fetch([urn]) // Update in the background
        .then((response: any) => {
          if (!response.entities[0]) {
            return;
          }

          const entity = response.entities[0];
          entity.require_login = response.require_login
            ? response.require_login
            : false;

          if (entity && entity.urn !== urn) {
            // urns may differn so fix this
            entity.urn = urn;
            this.entities.set(urn, new BehaviorSubject(null));
            this.addEntity(entity);
          }

          const entit = this.entities.get(urn);
          observer.next(entit);
          observer.complete();
        });
    });
  }

  /**
   * Cast to activities or not
   * @param cast boolean
   * @return EntitiesService
   */
  setCastToActivities(cast: boolean): EntitiesService {
    this.castToActivites = cast;
    return this;
  }

  /**
   * Cast to activities or not
   * @param cast boolean
   * @return EntitiesService
   */
  setExportUserCounts(value: boolean): EntitiesService {
    this.exportUserCounts = value;
    return this;
  }

  /**
   * Fetch entities
   * @param urns string[]
   * @return []
   */
  async fetch(urns: string[]): Promise<Array<Object>> {
    try {
      const response: any = await this.client.get('api/v2/entities/', {
        urns,
        as_activities: this.castToActivites ? 1 : 0,
        export_user_counts: this.exportUserCounts,
      });

      if (!response.entities.length) {
        for (const urn of urns) {
          if (response.require_login) {
            this.addLoginRequiredEntity(urn);
          } else {
            this.addNotFoundEntity(urn);
          }
        }
      }

      for (const entity of response.entities) {
        entity.require_login = response.require_login
          ? response.require_login
          : false;
        this.addEntity(entity);
      }

      return response;
    } catch (err) {
      // TODO: find a good way of sending server errors to subscribers
    }
  }

  /**
   * Add or resync an entity
   * @param entity
   * @return void
   */
  addEntity(entity): void {
    if (this.entities.has(entity.urn)) {
      this.entities.get(entity.urn).next(entity);
    } else {
      this.entities.set(entity.urn, new BehaviorSubject(entity));
    }
  }

  /**
   * Register a urn as not found
   * @param urn string
   * @return void
   */
  addNotFoundEntity(urn): void {
    if (!this.entities.has(urn)) {
      this.entities.set(urn, new BehaviorSubject(null));
    }
    this.entities.get(urn).error('Not found');
  }

  /**
   * Register a urn as requiring login.
   * @param { string } urn - entity urn.
   * @return { void }
   */
  private addLoginRequiredEntity(urn: string): void {
    if (!this.entities.has(urn)) {
      this.entities.set(urn, new BehaviorSubject(null));
    }

    this.entities.get(urn).error({
      status: 401,
      message: 'You must be logged in to view this content',
    });
  }

  static _(client: Client, blockListService: BlockListService) {
    return new EntitiesService(client, blockListService);
  }
}
