import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/api/api.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable()
export class HashtagDefaultsService {
  /**
   * Tags list
   */
  readonly tags$: Observable<Array<string>>;

  /**
   * Constructor. Sets up Observable.
   * @param api
   */
  constructor(protected api: ApiService) {
    this.tags$ = this.api
      .get(`api/v2/hashtags/suggested`, {
        trending: 0,
        defaults: 1,
        limit: 100,
      })
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        map((response) =>
          response.tags
            .filter((tag) => tag.type === 'default')
            .map((tag) => tag.value)
        )
      );
  }
}
