import { Injectable } from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { map, switchAll } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';

/**
 * Suggested hashtags lookup service. RxJS-ready!
 */
@Injectable()
export class SuggestedService {
  constructor(protected api: ApiService) {}

  /**
   * Lookup RxJS pipe operator. Fetches from server, aborts previous request if necessary
   */
  lookup(): OperatorFunction<string, string[]> {
    return (input$) =>
      input$.pipe(
        map((query) => this.fetch(query, () => [])),
        switchAll()
      );
  }

  /**
   * Lookup or run fallback function RxJS pipe operator. Fetches from server, aborts previous request if necessary
   */
  lookupOr(fallbackFn: () => string[]): OperatorFunction<string, string[]> {
    return (input$) =>
      input$.pipe(
        map((query) => this.fetch(query, fallbackFn)),
        switchAll()
      );
  }

  /**
   * Fetch from server, unless query is empty which will insta-resolve to an empty array
   * @param query
   * @param fallbackFn
   */
  protected fetch(query, fallbackFn: () => string[]): Observable<string[]> {
    if (!query) {
      return of(fallbackFn());
    }

    return this.api
      .get(`api/v2/search/suggest/tags`, {
        q: query,
      })
      .pipe(map((response) => response.tags));
  }
}
