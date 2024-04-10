import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, combineLatest } from 'rxjs';
import { ApiService } from '../../../../../../common/api/api.service';
import { map, switchAll, tap, catchError } from 'rxjs/operators';

@Injectable()
export class ChannelShopMembershipsMembersService {
  /**
   * InProgress reference
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * The currently scope entity guid
   */
  readonly entityGuid$: BehaviorSubject<any> = new BehaviorSubject(null);

  readonly supportTierFilter$: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  /**
   * Returns a list of support tier members
   */
  readonly supportTierMembers$: Observable<any> = combineLatest(
    this.entityGuid$,
    this.supportTierFilter$
  ).pipe(
    tap(() => this.inProgress$.next(true)),
    map(([entityGuid, supportTierFilter]) => {
      supportTierFilter = encodeURIComponent(supportTierFilter);
      return entityGuid
        ? this.apiService.get(
            `api/v3/wire/supporttiers/members/${entityGuid}/${supportTierFilter}`
          )
        : of(null);
    }),
    switchAll(),
    map((response) => (response && response.members) || []),
    tap(() => this.inProgress$.next(false)),
    catchError((err) => {
      return of(null);
    })
  );

  constructor(private apiService: ApiService) {}
}
