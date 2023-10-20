import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  map,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { MindsUser } from '../../../interfaces/entities';
import { NetworksListGetParams } from '../network.types';

/**
 * Perform tasks related to the list of a group's members
 */
@Injectable()
export class NetworksListService {
  public readonly user$: BehaviorSubject<MindsUser> = new BehaviorSubject<
    MindsUser
  >(null);

  constructor(private api: ApiService) {}

  /**
   * Get list of members from API
   * @param { number } limit - limit to request from API.
   * @param { number } offset - offset to request from API.
   * @returns { Observable<ApiResponse> } response from API.
   */
  public getList$(
    limit: number = 12,
    offset: number = 0
  ): Observable<ApiResponse | { redirect: boolean; errorMessage: any }> {
    return this.user$.pipe(
      switchMap((user: MindsUser) => {
        let endpoint = `api/v3/tenants`; // ojm todo

        let params: NetworksListGetParams = {
          limit: limit,
          offset: offset,
        };

        return this.api.get<ApiResponse>(endpoint, params);
      }),
      catchError(e => {
        return of(null);
      }),
      shareReplay()
    );
  }
}
