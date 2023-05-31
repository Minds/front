import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  map,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { ApiService } from '../../../common/api/api.service';

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

  /** Next paging token for groups list */
  public groupsNextPagingToken$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);

  /** Current paging token groups list */
  public groupsPagingToken$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('0');

  /** Whether groups fetch request is in progress */
  public groupsLoadInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Whether last groups fetch request returned a paging token indicating that more can be fetched */
  public groupsHasNext$: Observable<boolean> = this.groupsPagingToken$.pipe(
    map((pagingToken: string) => Boolean(pagingToken))
  );

  /** List of groups. */
  public readonly groups$: Observable<any[]> = this.groupsPagingToken$.pipe(
    debounceTime(100), // Hack to prevent first cancelled call
    tap(_ => this.groupsLoadInProgress$.next(true)),
    switchMap(pagingOffset =>
      this.api.get('api/v1/groups/member', {
        offset: pagingOffset,
        limit: 12,
      })
    ),
    tap(response => {
      this.groupsNextPagingToken$.next(response['load-next']);
    }),
    map(response => response.groups || []),
    tap(_ => this.groupsLoadInProgress$.next(false)),
    scan((a, c) => [...a, ...c], []),
    shareReplay()
  );

  /**
   * Load next batch of groups.
   * returns { void }
   */
  public loadNextGroups(): void {
    this.groupsPagingToken$.next(this.groupsNextPagingToken$.getValue());
  }

  constructor(private api: ApiService) {}
}
