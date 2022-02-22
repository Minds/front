import { BehaviorSubject } from 'rxjs';
import { ApiRequestMethod, ApiResponse, ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { StorageV2 } from '../../services/storage/v2';

enum CachePolicy {
  /**
   * fetch from remote and cache the result. return cache only
   * when remote was unavailable
   */
  fetchAndCache = 'fetchAndCache',
  /**
   * completely disregard cache
   */
  fetchOnly = 'fetchOnly',
  /**
   * return cache if available, then fetch and update result
   */
  cacheThenFetch = 'cacheThenFetch',
  /**
   * if cache was available, return it and don't fetch anything else.
   * if cache wasn't available, fetch and update result
   */
  cacheOnly = 'cacheOnly',
}

enum CacheStorage {
  /** indexedDb user storage */
  User = 'user',
  /** in memory storage */
  Memory = 'memory',
  /** session storage */
  Session = 'session',
}

enum UpdatePolicy {
  replace,
  merge,
}

type ApiResourceOptions = {
  /**
   * the request method
   */
  method?: ApiRequestMethod;
  /**
   * fetch query params
   */
  params?: any;
  /**
   * the endpoint url
   */
  url?: string;
  /**
   * TODO
   */
  updatePolicy?: UpdatePolicy;
  /**
   * TODO
   */
  cachePolicy?: CachePolicy;
  /**
   * where to store the cache.
   * the keys of this enum are the attributes of StorageV2 service
   */
  cacheStorage?: CacheStorage;
};

/**
 * TODO
 */
@Injectable()
export class ApiResourceService<T> {
  public loading$ = new BehaviorSubject(false);
  public error$ = new BehaviorSubject('');
  public result$: BehaviorSubject<T> = new BehaviorSubject(undefined);

  protected api: ApiService;
  protected storage: StorageV2;

  public load;
  public call;

  static CachePolicy = CachePolicy;
  static CacheStorage = CacheStorage;
  static UpdatePolicy = UpdatePolicy;

  constructor(private _options: ApiResourceOptions = {}) {
    if (this.options.method === ApiRequestMethod.GET) {
      this.load = this.fetch;
    } else {
      this.call = this.fetch;
    }
  }

  public setOptions(opts: ApiResourceOptions) {
    this._options = opts;
  }

  public get options() {
    return {
      method: ApiRequestMethod.GET,
      updatePolicy: UpdatePolicy.replace,
      cachePolicy: CachePolicy.cacheThenFetch,
      cacheStorage: CacheStorage.User,
      ...this._options,
    };
  }

  /**
   * @param { object } data
   * @returns { T }
   */
  private async fetch(params: any) {
    if (!this.options.url) {
      throw new Error('url not provided');
    }

    // restore from cache on fetch
    if (
      this.options.cachePolicy === CachePolicy.cacheOnly ||
      this.options.cachePolicy === CachePolicy.cacheThenFetch
    ) {
      const rehydratedResult = await this.rehydrate(params);

      if (
        this.options.cachePolicy === CachePolicy.cacheOnly &&
        rehydratedResult
      ) {
        return rehydratedResult;
      }
    }

    this.loading$.next(true);
    this.error$.next('');

    try {
      const response = await this.api[this.options.method](
        this.options.url,
        Object.assign({}, this.options.params, params)
      ).toPromise();

      this.result$.next(this.updateState(response));

      // only cache get requests
      if (
        this.options.method === ApiRequestMethod.GET &&
        this.options.cachePolicy !== CachePolicy.fetchOnly
      ) {
        this.persist(params);
      }
    } catch (e) {
      this.error$.next(e);
      throw e;
    } finally {
      this.loading$.next(false);
    }

    return this.result$.getValue();
  }

  /**
   * updates the response based on the policy provided
   * TODO
   */
  private updateState(response: ApiResponse): T {
    switch (this.options.updatePolicy) {
      case UpdatePolicy.merge:
      case UpdatePolicy.replace:
      default:
        return response as any;
    }
  }

  /**
   * persists the api response to the storage
   * @param { object } params
   * @returns { Promise }
   */
  private persist(params) {
    return this.storage[this.options.cacheStorage].setApiResource(
      this.cacheKey(params),
      this.result$.getValue()
    );
  }

  /**
   * returns the cache key of the resource
   * @param { object } params
   * @returns { string } cacheKey
   */
  private cacheKey(params?: any) {
    return `${this.options.url}?${JSON.stringify(
      Object.assign({}, this.options.params || {}, params || {})
    )}`;
  }

  /**
   * restores the resource result from storage
   * @param { object } params
   * @returns { Promise } result
   */
  private async rehydrate(params?: any) {
    const resource = await this.storage[
      this.options.cacheStorage
    ].getApiResource(this.cacheKey(params));
    if (resource) {
      this.result$.next(resource.data);
    }

    return resource?.data;
  }
}
