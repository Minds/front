import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { ApiRequestMethod, ApiResponse, ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { StorageV2 } from './../../services/storage/v2';

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

type ApiResourceOptions<P> = {
  /**
   * the request method
   */
  method?: ApiRequestMethod;
  /**
   * fetch query params
   */
  params?: P;
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

export class ResourceRef<T, P> {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject('');
  data$: BehaviorSubject<T> = new BehaviorSubject(undefined);

  constructor(
    private _api: ApiService,
    private _storage: StorageV2,
    private _url: string,
    private _options: ApiResourceOptions<P>
  ) {
    this._fetch();
  }

  setOptions(opts: ApiResourceOptions<P>) {
    this._options = opts;
  }

  get options() {
    return {
      url: this._url,
      method: ApiRequestMethod.GET,
      updatePolicy: UpdatePolicy.replace,
      cachePolicy: CachePolicy.cacheThenFetch,
      cacheStorage: CacheStorage.Memory,
      ...this._options,
    };
  }

  /**
   * refetches the data and replaces the data
   * @param params
   * @returns
   */
  refetch = (params: P): Promise<T> =>
    this._fetch(params, { updatePolicy: UpdatePolicy.replace });

  /**
   * fetches the data again and merges it in the data
   * @param params
   * @returns
   */
  fetchMore = (params: P): Promise<T> =>
    this._fetch(params, { updatePolicy: UpdatePolicy.merge });

  /**
   * @param { object } data
   * @returns { T }
   */
  private async _fetch(
    _params?: P,
    optionsOverride?: ApiResourceOptions<P>
  ): Promise<T> {
    const options = Object.assign({}, this.options, optionsOverride);
    const params = Object.assign({}, options.params, _params);

    if (!options.url) {
      throw new Error('url not provided');
    }

    // restore from cache on fetch
    if (
      options.cachePolicy === CachePolicy.cacheOnly ||
      options.cachePolicy === CachePolicy.cacheThenFetch
    ) {
      const rehydratedResult = await this._rehydrate(params);

      if (options.cachePolicy === CachePolicy.cacheOnly && rehydratedResult) {
        return rehydratedResult;
      }
    }

    this.loading$.next(true);
    this.error$.next('');

    try {
      const response = await this._api[options.method](
        options.url,
        Object.assign({}, options.params, params)
      ).toPromise();

      this.data$.next(this._updateState(response));

      // only cache get requests
      if (
        options.method === ApiRequestMethod.GET &&
        options.cachePolicy !== CachePolicy.fetchOnly
      ) {
        this._persist(params);
      }
    } catch (e) {
      this.error$.next(e);
      throw e;
    } finally {
      this.loading$.next(false);
    }

    return this.data$.getValue();
  }

  /**
   * updates the response based on the policy provided
   * TODO
   */
  private _updateState(response: ApiResponse): T {
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
  private _persist(params) {
    return this._storage[this.options.cacheStorage].setApiResource(
      this._cacheKey(params),
      this.data$.getValue()
    );
  }

  /**
   * returns the cache key of the resource
   * @param { object } params
   * @returns { string } cacheKey
   */
  private _cacheKey(params?: any) {
    return `${this.options.url}?${JSON.stringify(
      Object.assign({}, this.options.params || {}, params || {})
    )}`;
  }

  /**
   * restores the resource result from storage
   * @param { object } params
   * @returns { Promise } result
   */
  private async _rehydrate(params?: any) {
    const resource = await this._storage[
      this.options.cacheStorage
    ].getApiResource(this._cacheKey(params));
    if (resource) {
      this.data$.next(resource.data);
    }

    return resource?.data;
  }
}

@Injectable()
export class ApiResource {
  static CachePolicy = CachePolicy;
  static CacheStorage = CacheStorage;
  static UpdatePolicy = UpdatePolicy;

  constructor(protected api: ApiService, protected storage: StorageV2) {}

  /**
   * get data from an endpoint
   * @param url endpoint url
   * @param opts options
   * @returns
   */
  public query<T, P>(
    // TODO: let this be a name like 'recommendations' so we can have access
    // to this resource from elsewhere without explicitly defining the url. and let the cache key be
    // this name rather than the url and query combined
    url: string,
    opts: ApiResourceOptions<P>
  ): ResourceRef<T, P> {
    return new ResourceRef(this.api, this.storage, url, {
      method: ApiRequestMethod.GET,
      ...opts,
    });
  }

  /**
   * updates data from an endpoint
   * @param url endpoint url
   * @param opts options
   * @returns
   */
  public mutate<T, P>(
    url: string,
    opts: ApiResourceOptions<P>
  ): ResourceRef<T, P> {
    return new ResourceRef(this.api, this.storage, url, {
      method: ApiRequestMethod.POST,
      ...opts,
    });
  }
}
