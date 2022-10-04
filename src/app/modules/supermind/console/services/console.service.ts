import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';
import { SupermindConsoleListType } from '../../supermind.types';

/**
 * Supermind console service for loading of inbox / outbox.
 */
@Injectable({ providedIn: 'root' })
export class SupermindConsoleService {
  /** @type { BehaviorSubject<SupermindConsoleListType> }  listType$ - Subject containing list type for console to display */
  public readonly listType$: BehaviorSubject<
    SupermindConsoleListType
  > = new BehaviorSubject<SupermindConsoleListType>('inbox');

  /** @type { Observable<boolean> } Whether this is a single Supermind page. */
  public isSingleSupermindPage$: Observable<boolean> = this.listType$.pipe(
    map(listType => this.isNumericListType(listType))
  );

  constructor(private api: ApiService) {}

  /**
   * Get appropriate Supermind list from API based on list type.
   * @param { number } offset - offset to request from API.
   * @param { number } limit - limit to request from API.
   * @returns { Observable<ApiResponse> } response from API.
   */
  public getList$(
    limit: number = 12,
    offset: number = 0
  ): Observable<ApiResponse> {
    return this.listType$.pipe(
      take(1),
      switchMap((listType: any) => {
        let endpoint = `api/v3/supermind/${listType}`;

        let params = !this.isNumericListType(listType)
          ? { limit: limit, offset: offset }
          : {};

        return this.api.get(endpoint, params);
      }),
      catchError(e => {
        console.error(e);
        return of(null);
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
