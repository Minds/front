import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  GetUsersByRoleGQL,
  GetUsersByRoleQuery,
  GetUsersByRoleQueryVariables,
  Role,
  UserRoleEdge,
} from '../../../../../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { AssignRolesModalService } from './assign-roles-modal/assign-roles-modal.service';
import { RoleId } from '../../roles.types';
import { MultiTenantRolesService } from '../../../../../services/roles.service';
import { Filter } from '../../../../../../../interfaces/dashboard';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { Session } from '../../../../../../../services/session';
import * as _ from 'lodash';

/**
 * List of tenant users and their roles. Allows changing the roles for a given user via the AssignRolesModal
 */
@Component({
  selector: 'm-networkAdminConsoleRoles__users',
  templateUrl: './users.component.html',
  styleUrls: [
    './users.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleRolesUsersComponent
  implements OnInit, OnDestroy
{
  /** Whether loading is in progress. */
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** List of users to be displayed. */
  public users$: BehaviorSubject<UserRoleEdge[]> = new BehaviorSubject<
    UserRoleEdge[]
  >([]);

  /** Query reference */
  public getUsersByRoleQuery: QueryRef<
    GetUsersByRoleQuery,
    GetUsersByRoleQueryVariables
  >;

  /** Whether pagination has next page. */
  public readonly hasNextPage$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Role to be displayed */
  public readonly roleFilter$: BehaviorSubject<RoleId | null> =
    new BehaviorSubject<RoleId | null>(null);

  /** Enum for display in component. */
  public readonly RoleId: typeof RoleId = RoleId;

  /** Cursor for pagination. */
  private endCursor: string = null;

  /** Limit of entities to load per call. */
  private readonly limit: number = 12;

  // Subscriptions.
  public subscriptions: Subscription[] = [];

  /**
   * Holds options for the role filter
   */
  filter: Filter = {
    id: 'role',
    label: 'Role:',
    options: [],
  };

  constructor(
    private service: MultiTenantRolesService,
    private assignRolesModal: AssignRolesModalService,
    private getUsersByRoleGQL: GetUsersByRoleGQL,
    protected configs: ConfigsService,
    private session: Session
  ) {}

  ngOnInit(): void {
    // Set up query.
    this.getUsersByRoleQuery = this.getUsersByRoleGQL.watch(
      {
        first: this.limit,
        after: null,
        roleId: this.roleFilter$.getValue(),
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
      this.getUsersByRoleQuery.valueChanges.subscribe(
        (result: ApolloQueryResult<GetUsersByRoleQuery>): void => {
          if (result.loading) {
            return;
          }
          this.handleQueryResult(result);
          this.inProgress$.next(false);
        }
      ),
      this.service.allRoles$.subscribe((allRoles) => {
        if (allRoles) {
          this.buildRoleFilterOptions(allRoles);
        }
      }),
      this.assignRolesModal.updatedUserWithRoles$.subscribe(
        (updatedUserWithRoles) => {
          // Update the list when a user's role changes inside the modal
          if (updatedUserWithRoles) {
            this.updateUsersList(updatedUserWithRoles);
          }
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
   * @param { ApolloQueryResult<GetUsersByRoleQuery> } result - query result.
   * @returns { void }
   */
  public handleQueryResult(
    result: ApolloQueryResult<GetUsersByRoleQuery>
  ): void {
    // Append new users to the existing list
    const users: UserRoleEdge[] = this.users$.getValue();

    const edges = _.cloneDeep(
      result?.data?.usersByRole?.edges.slice(users.length)
    ); // Clone as we need to modify the data (Apollo won't let us do this)

    for (let edge of edges ?? []) {
      if (edge && typeof edge.node.legacy === 'string') {
        // Modify the cloned edge with parsed legacy property
        edge.node.legacy = JSON.parse(edge.node.legacy);
      }

      users.push(edge as UserRoleEdge);
    }

    this.users$.next(users);

    // Handle paging
    this.hasNextPage$.next(
      result?.data?.usersByRole?.pageInfo?.hasNextPage ?? false
    );

    this.endCursor = result?.data?.usersByRole?.pageInfo?.endCursor ?? null;
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

    this.getUsersByRoleQuery.fetchMore({
      variables: {
        after: this.endCursor,
      },
    });
  }

  /**
   * Filters list to show a specific role
   * @param { RoleId } roleId - type for the tab clicked.
   * @returns { void }
   */
  public onFilterChange($event): void {
    if (this.inProgress$.getValue()) {
      console.warn('Attempted to apply filter whilst loading is in progress.');
      return;
    }

    let selectedFilter = $event.option.id;
    if (selectedFilter === 'all') {
      selectedFilter = null;
    } else {
      selectedFilter = Number(selectedFilter);
    }

    this.roleFilter$.next(selectedFilter);
    this.inProgress$.next(true);

    // reset list
    this.users$.next([]);
    this.endCursor = null;
    this.hasNextPage$.next(true);

    this.getUsersByRoleQuery.refetch({
      first: this.limit,
      after: null,
      roleId: this.roleFilter$.getValue(),
    });
  }

  /**
   * Set up the role filter options
   * @param roles
   * @returns
   */
  public buildRoleFilterOptions(roles: Role[]) {
    if (this.filter.options.length > 0) {
      return;
    }
    let roleOptions = [
      {
        id: 'all',
        label: 'All',
      },
    ];

    for (let role of roles) {
      roleOptions.push({
        id: role.id.toString(),
        label: this.toTitleCase(role.name),
      });
    }

    this.filter.options = roleOptions;
  }

  /**
   * Update the users$ list when a user's roles change
   * @param updatedUser
   */
  public updateUsersList(updatedUser: UserRoleEdge): void {
    if (!updatedUser.node) {
      return;
    }

    const currentUsers = this.users$.getValue();

    // Find the index of the user with the matching node.guid
    const indexToUpdate = currentUsers.findIndex(
      (user) => user.node.guid === updatedUser.node.guid
    );

    if (indexToUpdate === -1) {
      console.warn(
        `User with guid ${updatedUser.node.guid} not found in the users$ list.`
      );
      return;
    }

    const updatedUsers = [...currentUsers];
    updatedUsers[indexToUpdate] = updatedUser;

    this.users$.next(updatedUsers);
  }

  /**
   * Called when assign roles button is clicked. Will open modal
   * to allow the user's roles to be edited
   * @returns { void }
   */
  public onAssignRolesClick(userWithRoles: UserRoleEdge): void {
    this.assignRolesModal.open(userWithRoles);
  }

  protected toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  getUserAvatarUrl(userNode): string {
    return `${this.configs.get('cdn_url')}icon/${userNode.guid}/medium/${
      userNode.legacy.icontime
    }`;
  }
}
