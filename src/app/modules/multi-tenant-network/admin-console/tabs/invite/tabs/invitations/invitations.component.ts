import { InviteService } from '../../../../../services/invite.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  GetInvitesGQL,
  GetInvitesQuery,
  GetInvitesQueryVariables,
  InviteEdge,
  InviteEmailStatusEnum,
} from '../../../../../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { RoleId } from '../../../roles/roles.types';
import * as _ from 'lodash';

/**
 * List of invitations that have been sent. Invitations can be cancelled.
 */
@Component({
  selector: 'm-networkAdminConsoleInvite__invitations',
  templateUrl: './invitations.component.html',
  styleUrls: [
    './invitations.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleInviteInvitationsComponent
  implements OnInit, OnDestroy {
  /** Whether loading is in progress. */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** List of invites to be displayed. */
  public invites$: BehaviorSubject<InviteEdge[]> = new BehaviorSubject<
    InviteEdge[]
  >([]);

  /** Search query. */
  public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /** Query reference */
  public getInvitesQuery: QueryRef<GetInvitesQuery, GetInvitesQueryVariables>;

  /** Whether pagination has next page. */
  public readonly hasNextPage$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Enum for display in component. */
  public readonly RoleId: typeof RoleId = RoleId;

  /** Cursor for pagination. */
  private endCursor: string = null;

  /** Limit of entities to load per call. */
  private readonly limit: number = 12;

  // Subscriptions.
  public subscriptions: Subscription[] = [];

  /**
   * Allows us to use enum in the template
   */
  public InviteStatus: typeof InviteEmailStatusEnum = InviteEmailStatusEnum;

  constructor(
    private service: InviteService,
    private getInvitesGQL: GetInvitesGQL,
    protected configs: ConfigsService
  ) {}

  ngOnInit(): void {
    // Set up query.
    this.getInvitesQuery = this.getInvitesGQL.watch(
      {
        first: this.limit,
        after: null,
        search: this.search$.getValue(),
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );

    // Respond to value changes.
    this.subscriptions.push(
      this.getInvitesQuery.valueChanges.subscribe(
        (result: ApolloQueryResult<GetInvitesQuery>): void => {
          if (result.loading) {
            return;
          }

          this.handleQueryResult(result);
          this.inProgress$.next(false);
        }
      )
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Handles the receipt of a new query response.
   * @param { ApolloQueryResult<GetInvitesQuery> } result - query result.
   * @returns { void }
   */
  public handleQueryResult(result: ApolloQueryResult<GetInvitesQuery>): void {
    // Append new invites to the existing list
    const invites: InviteEdge[] = this.invites$.getValue();

    // NOTE: this result provides only the newly-fetched items,
    // not all of them. So we dont need to slice the results
    const edges = _.cloneDeep(result?.data?.invites?.edges); // Clone as we need to modify the data (apollo wont let us do this)

    for (let edge of edges ?? []) {
      invites.push(edge as InviteEdge);
    }

    this.invites$.next(invites);

    // Handle paging
    this.hasNextPage$.next(
      result?.data?.invites?.pageInfo?.hasNextPage ?? false
    );

    this.endCursor = result?.data?.invites?.pageInfo?.endCursor ?? null;
  }

  /**
   * Loads next entities.
   * @returns { void }
   */
  public fetchMore(): void {
    if (this.inProgress$.getValue()) {
      return;
    }
    this.inProgress$.next(true);

    this.getInvitesQuery.fetchMore({
      variables: {
        after: this.endCursor,
      },
    });
  }

  /**
   * Cancels an invite
   * and removes it from the list
   * */
  protected async cancelInvite(invite: InviteEdge): Promise<void> {
    this.subscriptions.push(
      await this.service.cancelInvite(invite).subscribe(success => {
        if (success) {
          this.updateInvitesList(invite, true);
        }
      })
    );
  }

  /**
   * Resends an invite
   */
  protected async resendInvite(invite: InviteEdge): Promise<void> {
    this.subscriptions.push(
      await this.service.resendInvite(invite).subscribe(success => {
        let pendingInvite: InviteEdge = { ...invite };
        pendingInvite.node.status = InviteEmailStatusEnum.Pending;
        if (success) {
          this.updateInvitesList(pendingInvite);
        }
      })
    );
  }

  /**
   * Update the invites$ list when a invite's status changes
   * (or when it is removed from the list)
   * @param updatedInvite
   */
  public updateInvitesList(
    updatedInvite: InviteEdge,
    canceled: boolean = false
  ): void {
    if (!updatedInvite.node) {
      return;
    }

    const currentInvites = this.invites$.getValue();

    // Find the index of the invite with the matching node.id
    const indexToUpdate = currentInvites.findIndex(
      invite => invite.node.id === updatedInvite.node.id
    );

    if (indexToUpdate === -1) {
      console.warn(`Unable to update invites$ list because invite not found.`);
      return;
    }

    const updatedInvites = [...currentInvites];

    if (canceled) {
      // Remove it from the list if canceled
      updatedInvites.splice(indexToUpdate, 1);
    } else {
      updatedInvites[indexToUpdate] = updatedInvite;
    }

    this.invites$.next(updatedInvites);
  }
}
