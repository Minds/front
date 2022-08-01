import {
  BehaviorSubject,
  from,
  Observable,
  of,
  throwError,
  Subscription,
  interval,
} from 'rxjs';
import { ApiRequestMethod, ApiResponse, ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { StorageV2 } from './../../services/storage/v2';
import { debounce, switchMap, take, takeUntil } from 'rxjs/operators';

enum CachePolicy {
  /**
   * fetch from remote and cache the result. return cache only
   * when remote was unavailable
   */
  fetchFirst = 'fetchFirst',
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
  cacheFirst = 'cacheFirst',
  /**
   * only use cache
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

type ApiResourceOptions<T, P> = {
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
  updateState?: (newState: T, oldState: T) => any;
  /**
   * TODO
   */
  cachePolicy?: CachePolicy;
  /**
   * where to store the cache.
   * the keys of this enum are the attributes of StorageV2 service
   */
  cacheStorage?: CacheStorage;
  /**
   * skips auto-calling the endpoint
   */
  skip?: boolean;
};

export class ResourceRef<T, P> {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  error$: BehaviorSubject<string> = new BehaviorSubject('');
  data$: BehaviorSubject<T> = new BehaviorSubject(undefined);

  constructor(
    private _api: ApiService,
    private _storage: StorageV2,
    private _url: string,
    private _options: ApiResourceOptions<T, P>
  ) {
    // if cache storage was memory, fetch data immediately unless skip is true
    if (
      !this.options.skip &&
      this.options.method === ApiRequestMethod.GET &&
      this.options.cacheStorage === CacheStorage.Memory
    ) {
      switch (this.options.cachePolicy) {
        case CachePolicy.cacheThenFetch:
        case CachePolicy.cacheFirst:
        case CachePolicy.cacheOnly: // TODO: implement cacheOnly
          this.fetch(this.options.params, {
            cachePolicy: CachePolicy.cacheOnly,
          });
      }
    }
  }

  setOptions(opts: ApiResourceOptions<T, P>): ResourceRef<T, P> {
    this._options = {
      ...this._options,
      ...opts,
    };
    return this;
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

  setData(func: (oldData: any) => any) {
    const newData = func(this.data$.getValue());
    this.data$.next(newData);
    this._persist(); // TODO: check
  }

  /**
   *
   * @param _params
   * @param optionsOverride
   * @returns
   */
  public fetch(
    _params?: P,
    optionsOverride?: ApiResourceOptions<T, P>
  ): ResourceRef<T, P> {
    const options = Object.assign({}, this.options, optionsOverride);
    const params = Object.assign({}, options.params, _params);

    (async () => {
      let rehydratedResult;
      // rehydrate cache if policy allows
      rehydratedResult = await this._rehydrateIfPossible(options);

      switch (options.cachePolicy) {
        // return and don't attempt to fetch anymore
        case CachePolicy.cacheFirst:
          if (rehydratedResult) return; // don't fetch if we had cache
        case CachePolicy.cacheThenFetch:
          break; // continue to fetch since regardless if we have cache
        case CachePolicy.cacheOnly:
          return; // don't fetch, just cache
      }

      this.loading$.next(true);
      this.error$.next('');

      console.log(
        `[ApiResource] fetching for ${this.options.url}`,
        options.cachePolicy
      );
      this._api[options.method](options.url, params)
        .pipe(take(1))
        .toPromise()
        .then(response => {
          switch (options.cachePolicy) {
            // override and ignore previous cache
            case CachePolicy.cacheThenFetch:
              this.data$.next(
                this._updateState(response as any, undefined, options)
              );
              break;
            default:
              this.data$.next(
                this._updateState(
                  response as any,
                  this.data$.getValue(),
                  options
                )
              );
          }

          // only cache get requests
          if (
            options.method === ApiRequestMethod.GET &&
            options.cachePolicy !== CachePolicy.fetchOnly
          ) {
            // using options.params because we want to ignore custom params // TODO: explain why
            this._persist(options.params, options);
          }
        })
        .catch(e => {
          switch (options.cachePolicy) {
            // return and don't attempt to fetch anymore
            case CachePolicy.fetchFirst:
              if (rehydratedResult) {
                this.data$.next(
                  this._updateState(rehydratedResult as any, undefined, options)
                );
              }
              break;
          }

          this.error$.next(e);
          throw e;
        })
        .finally(() => {
          this.loading$.next(false);
        });
    })();

    return this;
  }

  private async _rehydrateIfPossible(
    options: ApiResourceOptions<T, P>
  ): Promise<any> {
    if (
      options.cachePolicy === CachePolicy.cacheOnly ||
      options.cachePolicy === CachePolicy.cacheFirst ||
      options.cachePolicy === CachePolicy.cacheThenFetch
    ) {
      // using options.params instead of params because we want to ignore custom params // TODO: explain why
      const rehydratedResult = await this._rehydrate(options.params, options);
      if (rehydratedResult) {
        this.data$.next(
          this._updateState(rehydratedResult as any, undefined, options)
        );
      }

      return rehydratedResult;
    }
  }

  /**
   * updates the response based on the policy provided
   * TODO
   */
  private _updateState(
    newDate: T,
    oldData: T,
    options: ApiResourceOptions<T, P> = this.options
  ): any {
    if (options.updateState) {
      return options.updateState(newDate, oldData);
    }
    switch (this.options.updatePolicy) {
      case UpdatePolicy.merge:
      case UpdatePolicy.replace:
      default:
        return newDate;
    }
  }

  /**
   * persists the api response to the storage
   * @param { object } params
   * @returns { Promise }
   */
  private _persist(
    params = this.options.params,
    options: ApiResourceOptions<T, P> = this.options
  ) {
    return this._storage[options.cacheStorage].setApiResource(
      this._cacheKey(params, options),
      this.data$.getValue()
    );
  }

  /**
   * returns the cache key of the resource
   * @param { object } params
   * @returns { string } cacheKey
   */
  private _cacheKey(
    params?: any,
    options: ApiResourceOptions<T, P> = this.options
  ) {
    return `${options.url}?${JSON.stringify(
      Object.assign({}, options.params || {}, params || {})
    )}`;
  }

  /**
   * restores the resource result from storage
   * @param { object } params
   * @returns { Promise } result
   */
  private async _rehydrate(
    params?: any,
    options: ApiResourceOptions<T, P> = this.options
  ) {
    const key = this._cacheKey(params, options);
    console.log('[ApiResource] cache key for', options.url, ' is ', key);

    const resource = await this._storage[options.cacheStorage].getApiResource(
      key
    );

    return resource?.data;
  }
}

export class QueryRef<T, P> extends ResourceRef<T, P> {
  /**
   * refetches the data and replaces the data
   * @param params
   * @returns
   */
  refetch = (params: P) =>
    this.fetch(params, { updatePolicy: UpdatePolicy.replace });

  /**
   * fetches the data again and merges it in the data
   * @param params
   * @returns
   */
  fetchMore = (params: P) =>
    this.fetch(params, {
      updatePolicy: UpdatePolicy.merge,
      cachePolicy: ApiResource.CachePolicy.fetchFirst,
    });
}

export class MutationRef<T, P> extends ResourceRef<T, P> {
  /**
   * fetches the data again and merges it in the data
   * @param params
   * @returns
   */
  mutate = (params: P) => this.fetch(params);
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
    // this name rather than the url and query combined. So we can do apiResource.updateCache('recommendations', {...})
    url: string,
    opts: ApiResourceOptions<T, P>
  ): QueryRef<T, P> {
    return new QueryRef(this.api, this.storage, url, {
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
  public mutation<T, P>(
    url: string,
    opts: ApiResourceOptions<T, P> = {}
  ): MutationRef<T, P> {
    return new MutationRef(this.api, this.storage, url, {
      method: ApiRequestMethod.POST,
      ...opts,
    });
  }
}

export const apiResourceMock = {
  query: () =>
    new QueryRef(null, null, null, {
      method: ApiRequestMethod.GET,
    }),
};
