import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { GroupMembershipLevel } from '../../v2/group.types';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';

export type GroupsMembershipsListGetParams = {
  limit?: number;
  offset?: number;
  group_membership_level?: GroupMembershipLevel;
  group_membership_gte?: boolean;
};

/**
 * Perform tasks related to the list of a user's groups
 */
@Injectable()
export class GroupsMembershipsListService {
  constructor(private api: ApiService) {}

  // Which membership level do we want to present?
  public readonly groupMembershipLevel$: BehaviorSubject<GroupMembershipLevel> =
    new BehaviorSubject<GroupMembershipLevel>(GroupMembershipLevel.MEMBER);

  // Show all groups in which the user is above the specified level
  public readonly membershipLevelGte$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Get list of groups from API
   * @param { number } limit - limit to request from API.
   * @param { number } offset - offset to request from API.
   * @returns { Observable<ApiResponse> } response from API.
   */
  public getList$(
    limit: number = 12,
    offset: number = 0
  ): Observable<ApiResponse | { redirect: boolean; errorMessage: any }> {
    return combineLatest([
      this.groupMembershipLevel$,
      this.membershipLevelGte$,
    ]).pipe(
      take(1),
      switchMap(
        ([level, membershipLevelGte]: [GroupMembershipLevel, boolean]) => {
          let endpoint = `api/v1/groups/member`;

          let params: GroupsMembershipsListGetParams = {
            limit: limit,
            offset: offset,
          };

          if (level && membershipLevelGte) {
            params['membership_level'] = level;
            params['membership_level_gte'] = membershipLevelGte;
          } else if (level) {
            params['level'] = level;
          }

          return this.api.get<ApiResponse>(endpoint, params);
        }
      ),
      catchError((e) => {
        return of(null);
      }),
      shareReplay()
    );
  }
}
