import { BehaviorSubject } from 'rxjs';
import { ApiRequestMethod, ApiResponse, ApiService } from './api.service';
import { Injectable } from '@angular/core';

type EndpointServiceOptions = {
  cache?: boolean;
  method?: ApiRequestMethod;
  params?: any;
};

@Injectable()
export class ApiResource<T> {
  public loading$ = new BehaviorSubject(false);
  public error$ = new BehaviorSubject('');
  public result$: BehaviorSubject<T> = new BehaviorSubject(undefined);
  private updatePolicy: 'merge' | 'replace' = 'replace';
  public api: ApiService;

  public load;

  constructor(
    public endpoint: string,
    public _options: EndpointServiceOptions
  ) {
    if (this.options.method === ApiRequestMethod.GET) {
      this.load = this.fetch;
    } else {
      throw new Error('not supported yet');
      this[ApiRequestMethod.GET] = this.fetch;
    }

    if (this.options.cache) {
      this.hydrate(this.options);
    }
  }

  get options() {
    return {
      method: ApiRequestMethod.GET,
      ...this._options,
    };
  }

  private async fetch(data: T) {
    this.loading$.next(true);
    this.error$.next('');

    try {
      const response = await this.api[this.options.method](
        this.endpoint,
        data || this.options.params
      ).toPromise();

      this.result$.next(this.updateState(response));

      if (this.options.cache) {
        this.persist(data);
      }
    } catch (e) {
      this.error$.next(e);
      throw e;
    } finally {
      this.loading$.next(false);
    }
  }

  /**
   * TODO
   */
  private updateState(response: ApiResponse): T {
    switch (this.updatePolicy) {
      case 'merge':
      case 'replace':
      default:
        return response as any;
    }
  }

  /**
   * TODO
   */
  private persist(params: any) {
    // save to storage
  }

  /**
   * TODO
   */
  private hydrate(options: any) {
    // restore from storage
  }
}
