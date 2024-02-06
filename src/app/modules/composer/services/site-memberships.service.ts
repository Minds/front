import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { catchError, map } from 'rxjs/operators';
import {
  GetSiteMembershipsGQL,
  GetSiteMembershipsQuery,
  SiteMembership,
} from '../../../../graphql/generated.engine';
import { ojmFakeMembershipsQuery } from './ojm-fake-memberships';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../common/services/toaster.service';

// ojm move this to common?
@Injectable({
  providedIn: 'root',
})
export class ComposerSiteMembershipsService {
  public allMemberships$: BehaviorSubject<
    SiteMembership[]
  > = new BehaviorSubject<SiteMembership[]>([]);

  /** Whether loading of memberships is in progress. */
  public readonly membershipLoadInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  constructor(
    private getSiteMembershipsGQL: GetSiteMembershipsGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Fetches memberships from the server and updates the memberships observable.
   * Checks if memberships have already been fetched to avoid duplicate calls.
   *
   * @returns { Promise<void> }
   */
  public async fetchMemberships(): Promise<void> {
    if (
      this.membershipLoadInProgress$.getValue() ||
      this.allMemberships$.getValue().length > 0
    ) {
      return;
    }

    this.membershipLoadInProgress$.next(true);

    try {
      // ojm uncomment
      // const response: ApolloQueryResult<GetSiteMembershipsQuery> = await lastValueFrom(
      //   this.getSiteMembershipsGQL.fetch()
      // );

      const response = ojmFakeMembershipsQuery;

      // ojm uncomment
      // if (response?.error || response?.errors?.length) {
      //   console.error(response?.errors ?? DEFAULT_ERROR_MESSAGE);
      //   throw new Error('An error has occurred while loading memberships');
      // }

      if (response?.data?.siteMemberships?.length) {
        this.allMemberships$.next(
          response?.data?.siteMemberships as SiteMembership[]
        );
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
    } finally {
      this.membershipLoadInProgress$.next(false);
    }
  }
}
