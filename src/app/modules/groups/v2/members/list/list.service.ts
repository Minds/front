import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { ApiResponse, ApiService } from '../../../../../common/api/api.service';
import {
  GroupMembershipGetParams,
  GroupMembershipLevel,
} from '../../group.types';
import { MindsGroup } from '../../group.model';

/**
 * Perform tasks related to the list of a group's members
 */
@Injectable()
export class GroupMembersListService {
  constructor(private api: ApiService) {}

  // The group
  public readonly group$: BehaviorSubject<MindsGroup> = new BehaviorSubject<
    MindsGroup
  >(null);

  // Which membership level do we want to present?
  public readonly groupMembershipLevel$: BehaviorSubject<
    GroupMembershipLevel
  > = new BehaviorSubject<GroupMembershipLevel>(GroupMembershipLevel.MEMBER);

  // Show all members above the specified level
  public readonly membershipLevelGte$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  // Search for a member
  public readonly searchQuery$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

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
    return combineLatest([
      this.group$,
      this.groupMembershipLevel$,
      this.membershipLevelGte$,
      // this.searchQuery$.pipe(debounceTime(300)),
    ]).pipe(
      take(1),
      switchMap(
        ([group, level, membershipLevelGte]: [
          MindsGroup,
          GroupMembershipLevel,
          boolean
          // string
        ]) => {
          let endpoint = `api/v1/groups/membership/${group.guid}`;

          let params: GroupMembershipGetParams = {
            limit: limit,
            offset: offset,
          };

          if (level && membershipLevelGte) {
            params['membership_level'] = level;
            params['membership_level_gte'] = membershipLevelGte;
          } else if (level) {
            params['level'] = level;
          }

          // if (q) {
          //   endpoint = `${endpoint}/search`;
          //   params.q = q;
          // }

          return this.api.get<ApiResponse>(endpoint, params);
        }
      ),
      catchError(e => {
        return of(null);
      }),
      shareReplay()
    );
  }
}
