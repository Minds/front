import { Injectable } from '@angular/core';
import {
  DismissGQL,
  DismissMutation,
  Dismissal,
  GetDismissalsGQL,
  GetDismissalsQuery,
} from '../../../graphql/generated.engine';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { Session } from '../../services/session';

export const CACHE_KEY = 'dismissals-v2';

/**
 * Dismissal service v2 - handles dismissal of an item by a given key.
 * Initially built for explainer screens with the intention that it can be used
 * for other front-end dismissible items in the future.
 */
@Injectable({ providedIn: 'root' })
export class DismissalV2Service {
  constructor(
    private getDismissalsGQL: GetDismissalsGQL,
    private dismissGQL: DismissGQL,
    private session: Session
  ) {}

  /**
   * Get dismissals from cache or API.
   * @param { boolean } bypassCache whether local cache should be bypassed.
   * @returns { Observable<Dismissal[]> } - dismissals.
   */
  public getDismissals(bypassCache: boolean = false): Observable<Dismissal[]> {
    if (!bypassCache) {
      const cachedDismissals: Dismissal[] = this.getCachedDismissals();

      if (cachedDismissals?.length) {
        return of(cachedDismissals);
      }
    }

    if (!this.session.isLoggedIn()) {
      return of([]);
    }

    return this.getDismissalsGQL.fetch().pipe(
      map((result: ApolloQueryResult<GetDismissalsQuery>): Dismissal[] => {
        return result.data.dismissals;
      }),
      tap((dismissals: Dismissal[]): void => {
        this.setCachedDismissals(dismissals);
      }),
      catchError((e: unknown): Observable<Dismissal[]> => {
        console.error(e);
        return of([]);
      })
    );
  }

  /**
   * Whether a given key has been dismissed.
   * @param { string } key - key to check.
   * @returns { Observable<boolean> } - whether key has been dismissed.
   */
  public isDismissed(key: string): Observable<boolean> {
    return this.getDismissals().pipe(
      map((dismissals: Dismissal[]): boolean => {
        return dismissals.some(
          (dismissal: Dismissal) => dismissal?.key === key
        );
      })
    );
  }

  /**
   * Dismiss an item by a given key.
   * @param { Observable<Dismissal> } key - key to dismiss.
   * @returns { Observable<Dismissal> } - dismissed item on success.
   */
  public dismiss(key: string): Observable<Dismissal> {
    if (!this.session.isLoggedIn()) {
      return of(null);
    }

    return this.dismissGQL.mutate({ key }).pipe(
      map((result: ApolloQueryResult<DismissMutation>): Dismissal => {
        return result?.data?.dismiss;
      }),
      tap((dismissal: Dismissal): void => this.addCachedDismissal(dismissal)),
      catchError((e: unknown): Observable<Dismissal> => {
        console.error(e);
        return of(null);
      })
    );
  }

  /**
   * Gets locally cached dismissals.
   * @returns { Dismissal[] } locally cached dismissals.
   */
  private getCachedDismissals(): Dismissal[] {
    try {
      return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Adds a dismissal to the local storage cache.
   * @param { Dismissals } dismissal - dismissal to add.
   * @returns { void }
   */
  private addCachedDismissal(dismissal: Dismissal): void {
    this.setCachedDismissals([
      ...this.getCachedDismissals(),
      {
        userGuid: dismissal.userGuid,
        key: dismissal.key,
        dismissalTimestamp: dismissal.dismissalTimestamp,
      },
    ]);
  }

  /**
   * Initially set or overwrite existing cached dismissals in local storage.
   * @param { Dismissal[] } dismissals - dismissals to set.
   * @returns { Promise<void> }
   */
  private async setCachedDismissals(dismissals: Dismissal[]): Promise<void> {
    try {
      dismissals = dismissals.map((dismissal: Dismissal): Dismissal => {
        return {
          userGuid: dismissal.userGuid,
          key: dismissal.key,
          dismissalTimestamp: dismissal.dismissalTimestamp,
        };
      });
      return localStorage.setItem(CACHE_KEY, JSON.stringify(dismissals));
    } catch (e) {
      console.error(e);
    }
  }
}
