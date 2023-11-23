import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
  shareReplay,
  take,
  tap,
} from 'rxjs';
import { ApolloQueryResult, MutationResult } from '@apollo/client';
import {
  AssignUserToRoleGQL,
  GetAssignedRolesGQL,
  GetRolesAndPermissionsGQL,
  GetRolesAndPermissionsQuery,
  PermissionsEnum,
  Role,
  SetRolePermissionGQL,
  SetRolePermissionMutation,
  SetRolePermissionMutationVariables,
  UnassignUserFromRoleGQL,
  AssignUserToRoleMutation,
  AssignUserToRoleMutationVariables,
  UnassignUserFromRoleMutation,
  UserRoleEdge,
  GetUsersByRoleQuery,
  GetUsersByRoleGQL,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { RoleId } from '../admin-console/tabs/roles/roles.types';
import { Session } from '../../../services/session';

/**
 * Service for management of
 * roles (i.e. what permissions each role has)
 * and what roles are assigned to users
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantRolesService implements OnDestroy {
  /** Subject to store all roles value. */
  public readonly allRoles$: BehaviorSubject<Role[]> = new BehaviorSubject<
    Role[]
  >(null);

  /** Subject to store all permissions value. */
  public readonly allPermissions$: BehaviorSubject<
    PermissionsEnum[]
  > = new BehaviorSubject<PermissionsEnum[]>(null);

  /** Subject to store all users with the owner role */
  public readonly owners$: BehaviorSubject<
    UserRoleEdge[]
  > = new BehaviorSubject<UserRoleEdge[]>(null);

  /**
   * All the roles assigned to the current logged in user
   */
  public loggedInUserRoles$: BehaviorSubject<Role[]> = new BehaviorSubject<
    Role[]
  >([]);

  private subscriptions: Subscription[] = [];

  constructor(
    private getRolesAndPermissionsGQL: GetRolesAndPermissionsGQL,
    private setRolePermissionGQL: SetRolePermissionGQL,
    private assignUserToRoleGQL: AssignUserToRoleGQL,
    private unassignUserFromRoleGQL: UnassignUserFromRoleGQL,
    private getAssignedRolesGQL: GetAssignedRolesGQL,
    private getUsersByRoleGQL: GetUsersByRoleGQL,
    private toaster: ToasterService,
    private permissions: PermissionsService,
    private session: Session
  ) {}

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  /**
   * Fetches roles and permissions from server
   */
  public fetchRolesAndPermissions(): void {
    this.subscriptions.push(
      this.getRolesAndPermissions().subscribe(
        (
          result: ApolloQueryResult<GetRolesAndPermissionsQuery> | null
        ): void => {
          if (result && result.data) {
            this.allRoles$.next(result.data?.allRoles);

            this.allPermissions$.next(
              this.getToggleablePermissions(result.data?.allPermissions)
            );
          }
        },
        (error: any): void => {
          console.error('Error fetching roles and permissions:', error);
        }
      )
    );
  }

  /**
   * Gets all roles and permissions from server.
   * @returns { Observable<ApolloQueryResult<GetRolesAndPermissionsQuery> | null>}
   */
  public getRolesAndPermissions(): Observable<ApolloQueryResult<
    GetRolesAndPermissionsQuery
  > | null> {
    return this.getRolesAndPermissionsGQL
      .fetch(null, {
        fetchPolicy: 'network-only',
      })
      .pipe(
        take(1),
        catchError(
          (e: unknown): Observable<null> => {
            console.error('getRolesAndPermissions Error: ', e);
            return of(null);
          }
        )
      );
  }

  /**
   * Toggles a role's permission on/off
   * @returns { Observable<boolean> } true if a role's permission was updated.
   */
  public setRolePermission(
    values: SetRolePermissionMutationVariables
  ): Observable<boolean> {
    if (!this.permissions.canAssignPermissions()) {
      this.toaster.error("You don't have permission to assign roles");
      return of(false);
    }

    return this.setRolePermissionGQL.mutate(values).pipe(
      take(1),
      map((result: MutationResult<SetRolePermissionMutation>) => {
        const updatedPermissions = result?.data?.setRolePermission.permissions;

        this.updateAllRolesLocalState(values.roleId, updatedPermissions);

        return Boolean(updatedPermissions);
      }),
      catchError(
        (e: any): Observable<boolean> => {
          if (e?.errors[0] && e.errors[0].message) {
            this.toaster.error(e.errors[0].message);
          }
          console.error(e);
          return of(false);
        }
      )
    );
  }

  private updateAllRolesLocalState(
    roleId: RoleId,
    updatedPermissions: PermissionsEnum[]
  ): void {
    // Update the permissions for the role in allRoles$
    this.allRoles$.pipe(take(1)).subscribe(roles => {
      const updatedRoles = roles.map(role => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: updatedPermissions,
          };
        }
        return role;
      });

      // Emit the updated array of roles
      this.allRoles$.next(updatedRoles);
    });
  }

  /**
   * Get the roles assigned to a user
   */
  getLoggedInUserRoles(): void {
    this.subscriptions.push(
      this.getAssignedRolesGQL
        .watch({
          userGuid: this.session.getLoggedInUser().guid,
        })
        .valueChanges.pipe(
          map(result => result.data?.assignedRoles || []),
          tap(roles => {
            if (roles) this.loggedInUserRoles$.next(roles);
          }),
          shareReplay()
        )
        .subscribe()
    );
  }

  /**
   * Fetches list of network owners from server
   */
  public fetchOwners(): void {
    this.subscriptions.push(
      this.getOwners().subscribe(
        (result: ApolloQueryResult<GetUsersByRoleQuery> | null): void => {
          if (result && result.data) {
            const owners: UserRoleEdge[] = [];
            for (let edge of result?.data?.usersByRole?.edges ?? []) {
              if (edge && typeof edge.node.legacy === 'string') {
                // Create a new object with parsed legacy property
                const newNode = {
                  ...edge.node,
                  legacy: JSON.parse(edge.node.legacy),
                };
                edge = {
                  ...edge,
                  node: newNode,
                };
              }

              owners.push(edge as UserRoleEdge);
            }
            this.owners$.next(owners);
          }
        },
        (error: any): void => {
          console.error('Error fetching owners:', error);
        }
      )
    );
  }

  /**
   * Gets all users in the network that have the OWNER role
   * @returns { Observable<ApolloQueryResult<GetUsersByRoleQuery> | null>}
   */
  private getOwners(): Observable<ApolloQueryResult<
    GetUsersByRoleQuery
  > | null> {
    return this.getUsersByRoleGQL
      .fetch(
        {
          roleId: RoleId.OWNER,
          first: 5,
          after: null,
        },
        {
          fetchPolicy: 'network-only',
        }
      )
      .pipe(
        take(1),
        catchError(
          (e: unknown): Observable<null> => {
            console.error('getOwners Error: ', e);
            return of(null);
          }
        )
      );
  }

  /**
   * Gives a role to a user
   * @returns { Observable<boolean> } true if the user was assigned to the role.
   */
  public assignUserToRole(
    currentUserWithRoles: UserRoleEdge,
    roleId: RoleId
  ): Observable<boolean> {
    if (!this.permissions.canAssignPermissions()) {
      this.toaster.error("You don't have permission to assign roles");
      return of(false);
    }

    const mutationVars: AssignUserToRoleMutationVariables = {
      userGuid: currentUserWithRoles.node.guid,
      roleId: roleId,
    };

    return this.assignUserToRoleGQL.mutate(mutationVars).pipe(
      take(1),
      map((result: MutationResult<AssignUserToRoleMutation>) => {
        return Boolean(result?.data?.assignUserToRole.name);
      }),
      catchError(
        (e: any): Observable<boolean> => {
          if (e?.errors?.[0] && e.errors[0].message) {
            this.toaster.error(e.errors[0].message);
          }
          console.error(e);
          return of(false);
        }
      )
    );
  }

  /**
   * Removes a role from a user
   * @returns { Observable<boolean> } true if the user was removed from the role.
   */
  public unassignUserFromRole(
    currentUserWithRoles: UserRoleEdge,
    roleId: RoleId
  ): Observable<boolean> {
    if (!this.permissions.canAssignPermissions()) {
      this.toaster.error("You don't have permission to assign roles");
      return of(false);
    }

    const mutationVars: AssignUserToRoleMutationVariables = {
      userGuid: currentUserWithRoles.node.guid,
      roleId: roleId,
    };

    return this.unassignUserFromRoleGQL.mutate(mutationVars).pipe(
      take(1),
      map((result: MutationResult<UnassignUserFromRoleMutation>) => {
        return result?.data?.unassignUserFromRole;
      }),
      catchError(
        (e: any): Observable<boolean> => {
          if (e?.errors?.[0] && e.errors[0].message) {
            this.toaster.error(e.errors[0].message);
          }
          console.error(e);
          return of(false);
        }
      )
    );
  }

  /**
   * Return all the permissions in allPermissions that are also toggleable.
   * @param allPermissions
   */
  private getToggleablePermissions(
    allPermissions: PermissionsEnum[]
  ): PermissionsEnum[] {
    // This is the order that the toggles will be presented
    const toggleablePermissions = [
      PermissionsEnum.CanCreatePost,
      PermissionsEnum.CanComment,
      PermissionsEnum.CanInteract,
      PermissionsEnum.CanCreateGroup,
      PermissionsEnum.CanUploadVideo,
    ];

    return toggleablePermissions.filter(permission =>
      allPermissions.includes(permission)
    );
  }

  getPermissionDisplayText(permission: PermissionsEnum): string {
    switch (permission) {
      case PermissionsEnum.CanCreatePost:
        return 'Create post';
      case PermissionsEnum.CanUploadVideo:
        return 'Upload video';
      case PermissionsEnum.CanComment:
        return 'Write comment';
      case PermissionsEnum.CanCreateGroup:
        return 'Create group';
      case PermissionsEnum.CanInteract:
        return 'Vote and remind';
      // The remaining PermissionsEnum values aren't displayed anywhere
    }

    return permission;
  }

  getIconByRoleId(roleId: RoleId): string {
    switch (roleId) {
      case RoleId.OWNER:
        return 'diamond';
      case RoleId.ADMIN:
        return 'account_circle';
      case RoleId.MODERATOR:
        return 'star';
      case RoleId.VERIFIED:
        return 'check';
      case RoleId.DEFAULT:
      default:
        return '';
    }
  }
}
