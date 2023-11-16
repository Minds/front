import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  firstValueFrom,
  lastValueFrom,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import { ApolloQueryResult, MutationResult } from '@apollo/client';
import {
  AssignUserToRoleGQL,
  GetRolesAndPermissionsGQL,
  GetRolesAndPermissionsQuery,
  PermissionsEnum,
  Role,
  SetRolePermissionGQL,
  SetRolePermissionMutation,
  SetRolePermissionMutationVariables,
  UnassignUserFromRoleGQL,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { RoleId } from '../admin-console/tabs/roles/roles.types';

/**
 * Service for fetching and updating multi-tenant network domains.
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

  private rolesAndPermissionsFetchSubscription: Subscription;

  constructor(
    private getRolesAndPermissionsGQL: GetRolesAndPermissionsGQL,
    private setRolePermissionGQL: SetRolePermissionGQL,
    private assignUserToRoleGQL: AssignUserToRoleGQL,
    private unassignUserFromRoleGQL: UnassignUserFromRoleGQL,
    private toaster: ToasterService,
    private permissions: PermissionsService
  ) {}

  ngOnDestroy(): void {
    this.rolesAndPermissionsFetchSubscription?.unsubscribe();
  }
  /**
   * Fetches roles and permissions from server
   */
  public fetchRolesAndPermissions(): void {
    this.rolesAndPermissionsFetchSubscription = this.getRolesAndPermissions().subscribe(
      (result: ApolloQueryResult<GetRolesAndPermissionsQuery> | null): void => {
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
      PermissionsEnum.CanCreateGroup,
      PermissionsEnum.CanUploadVideo,
    ];

    return toggleablePermissions.filter(permission =>
      allPermissions.includes(permission)
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

        this.updateLocalState(values.roleId, updatedPermissions);

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

  private updateLocalState(
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
      // The remaining PermissionsEnum values aren't displayed anywhere
    }

    return permission;
  }
}
