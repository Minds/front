import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';
import {
  SupermindConsoleCountParams,
  SupermindConsoleGetParams,
  SupermindConsoleListType,
  SupermindState,
} from '../../supermind.types';

/**
 * Supermind console service for loading of inbox / outbox.
 */
@Injectable({ providedIn: 'root' })
export class SupermindConsoleService {
  // Subject containing list type for console to display.
  public readonly listType$: BehaviorSubject<
    SupermindConsoleListType
  > = new BehaviorSubject<SupermindConsoleListType>('inbox');

  // Whether this is a single Supermind page.
  public readonly isSingleSupermindPage$: Observable<
    boolean
  > = this.listType$.pipe(map(listType => this.isNumericListType(listType)));

  constructor(private api: ApiService) {}

  /**
   * Get appropriate Supermind list from API based on list type.
   * @param { number } limit - limit to request from API.
   * @param { number } offset - offset to request from API.
   * @param { SupermindState } status - status filter.
   * @returns { Observable<ApiResponse> } response from API.
   */
  public getList$(
    limit: number = 12,
    offset: number = 0,
    status: SupermindState = null
  ): Observable<ApiResponse | { redirect: boolean; errorMessage: any }> {
    return this.listType$.pipe(
      take(1),
      switchMap((listType: any) => {
        if (listType === 'explore') {
          console.error('Cannot get explore list type in this way.');
          return of(null);
        }

        let endpoint = `api/v3/supermind/${listType}`;

        let params: SupermindConsoleGetParams = {};

        if (!this.isNumericListType(listType)) {
          params = { limit: limit, offset: offset };

          if (status) {
            params.status = status;
          }
        }

        return this.api.get<ApiResponse>(endpoint, params);
      }),
      catchError(e => {
        if (e.status === 403) {
          return of({ redirect: true, errorMessage: e.error.message });
        }
        return of(null);
      })
    );
  }

  /**
   * Get a count of all Supermind requests for a given status type.
   * @param { SupermindState } status - status to check (null will count ALL statuses).
   * @returns { Observable<number> } observable count.
   */
  public countAll$(status: SupermindState = null): Observable<number> {
    return this.listType$.pipe(
      // take once.
      take(1),
      // switch stream to be the api request and call it with correct list type and status.
      switchMap((listType: any) => {
        if (listType === 'explore') {
          console.error('Cannot count explore list type.');
          return of(null);
        }

        let endpoint: string = `api/v3/supermind/${listType}/count`;
        let params: SupermindConsoleCountParams = {};

        // If it's a single entity page, do not call endpoint, return 1.
        if (this.isNumericListType(listType)) {
          return of({ count: 1 });
        }

        if (status) {
          params.status = status;
        }

        return this.api.get(endpoint, params);
      }),
      // map to the count from the response.
      map((response: ApiResponse) => {
        return response['count'] ?? 0;
      }),
      // handle errors. WILL emit.
      catchError(e => {
        console.error(e);
        return of(null);
      })
    );
  }

  /**
   * Get a count of all Supermind requests for a given status type by list type.
   * @param { SupermindConsoleListType } listType - list type to check for.
   * @param { SupermindState } status - status to check (null will count ALL statuses).
   * @returns { Observable<number> } observable of count.
   */
  public countByListType$(
    listType: SupermindConsoleListType,
    status: SupermindState = null
  ): Observable<number> {
    if (listType === 'explore') {
      console.error('Cannot count explore list type.');
      return of(null);
    }

    let endpoint: string = `api/v3/supermind/${listType}/count`;
    let params: SupermindConsoleCountParams = {};

    // If it's a single entity page, do not call endpoint, return 1.
    if (this.isNumericListType(listType)) {
      return of(1);
    }

    if (status) {
      params.status = status;
    }

    return this.api.get(endpoint, params).pipe(
      map((response: ApiResponse) => {
        return response['count'] ?? 0;
      }),
      catchError((e: unknown) => {
        console.error(e);
        return of(0);
      })
    );
  }

  /**
   * Determine whether a list type is numeric.
   * @param { string | number } value - value to check.
   * @returns { boolean }
   */
  public isNumericListType(value: string | number): boolean {
    return !isNaN(Number(value));
  }
}
