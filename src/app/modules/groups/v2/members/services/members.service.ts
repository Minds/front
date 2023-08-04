import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  of,
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
// ojm rename this to members list service?? too confusing with membershipService
@Injectable()
export class GroupMembersService {
  constructor(
    // private groupService: GroupService // ojm maybe don't need this)
    private api: ApiService
  ) {}

  // The group
  public readonly group$: BehaviorSubject<MindsGroup> = new BehaviorSubject<
    MindsGroup
  >(null);

  // Which membership level do we want to present?
  // OJM NOTE this isn't implemented yet
  public readonly groupMembershipLevel$: BehaviorSubject<
    GroupMembershipLevel
  > = new BehaviorSubject<GroupMembershipLevel>(GroupMembershipLevel.MEMBER);

  // Search for a member
  public readonly searchQuery$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  // ojm need to handle search query Q here
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
      this.searchQuery$.pipe(debounceTime(300)),
    ]).pipe(
      take(1),
      switchMap(
        ([group, level, q]: [MindsGroup, GroupMembershipLevel, string]) => {
          console.log('ojm SVC getList$ 1', group, level, q);
          let endpoint = `api/v1/groups/membership/${group.guid}`;

          let params: GroupMembershipGetParams = {
            limit: limit,
            offset: offset,
          };

          if (q) {
            endpoint = `${endpoint}/search`;
            params.q = q;
          }
          console.log('ojm SVC getList$ 2', endpoint, params);

          // -------------------------------------------
          return this.api.get<ApiResponse>(endpoint, params);
        }
      ),
      catchError(e => {
        return of(null);
      })
    );
  }

  // ojm todo
  onKick(member) {
    // const index: number = this.members.findIndex(user => {
    //   return user.guid === $event.userGuid;
    // });
    // if (index > -1) {
    //   this.members.splice(index, 1);
    // }
  }
}
