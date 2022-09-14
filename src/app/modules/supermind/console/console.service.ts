import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { SupermindConsoleListType } from '../supermind.types';

/**
 * Supermind console service for loading of inbox / outbox.
 */
@Injectable({ providedIn: 'root' })
export class SupermindConsoleService {
  /** @var { BehaviorSubject<SupermindConsoleListType> }  listType$ - Subject containing list type for console to display */
  public readonly listType$: BehaviorSubject<
    SupermindConsoleListType
  > = new BehaviorSubject<SupermindConsoleListType>('inbox');

  constructor(private api: ApiService) {}

  /**
   * Get appropriate Supermind list from API based on list type.
   * @param { number } offset - offset to request from API.
   * @returns { Observable<ApiResponse> } response from API.
   */
  public getList$(offset: number = 0): Observable<ApiResponse> {
    return this.listType$.pipe(
      take(1),
      switchMap((listType: SupermindConsoleListType) => {
        const endpoint =
          listType === 'outbox'
            ? 'api/v3/supermind/outbox'
            : 'api/v3/supermind/inbox';
        return this.api.get(endpoint, { limit: 12, offset: offset });
      }),
      catchError(e => {
        console.error(e);
        return of(null);
      })
    );
  }
}
