import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { SelectableEntity } from '../../../common/components/selectable-entity-card/selectable-entity-card.component';

export type ActivityContainer = {
  guid: string;
  type: string;
  name?: string;
};

/**
 * Audience selector service. Used for the setting of audience (container) for an activity
 * and retrieval of possible entities that can be the audience (such as groups).
 */
@Injectable()
export class ComposerAudienceSelectorService {
  /** Currently selected audience - null is interpreted as a standard channel post */
  public readonly selectedAudience$: BehaviorSubject<
    ActivityContainer
  > = new BehaviorSubject<ActivityContainer>(null);

  /** Display name for the currently selected audience */
  public readonly audienceDisplayName$: Observable<
    string
  > = this.selectedAudience$.pipe(
    map((audience: any) => {
      if (audience && audience.type === 'group') {
        return audience.name;
      }
      return 'My Channel';
    })
  );

  /** Current paging token. */
  private readonly groupsPagingToken$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(0);

  /** Next paging token. */
  private readonly groupsNextPagingToken$: BehaviorSubject<
    number
  > = new BehaviorSubject<number>(0);

  /** Whether groups fetch request is in progress */
  public groupsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Whether last groups fetch request returned a paging token - indicating that more can be fetched */
  public groupsHasNext$: Observable<boolean> = this.groupsNextPagingToken$.pipe(
    map((offset: number): boolean => Boolean(offset))
  );

  public readonly shareToGroupMode$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /**
   * Groups page - change offset to advance page.
   */
  public readonly groupsPage$: Observable<
    SelectableEntity[]
  > = this.groupsPagingToken$.pipe(
    tap((_: unknown): void => this.groupsLoading$.next(true)),
    switchMap(
      (page: number): Observable<ApiResponse> =>
        this.api.get('api/v1/groups/member', {
          offset: page,
          limit: 12,
        })
    ),
    map((response: ApiResponse): SelectableEntity[] => {
      this.groupsNextPagingToken$.next(response['load-next'] ?? null);
      this.groupsLoading$.next(false);
      return response?.groups ?? [];
    }),
    catchError(
      (e: unknown): Observable<null> => {
        console.error(e);
        return of(null);
      }
    )
  );

  constructor(private api: ApiService) {}

  /**
   * Load next batch of groups.
   * @returns { void }
   */
  public loadNextGroups(): void {
    this.groupsPagingToken$.next(this.groupsNextPagingToken$.getValue());
  }

  /**
   * Reset state.
   * @returns { void }
   */
  public reset(): void {
    this.groupsPagingToken$.next(0);
    this.groupsNextPagingToken$.next(0);
  }
}
