import { CanActivateFn, Router } from '@angular/router';
import { PermissionsEnum } from '../../../graphql/generated.engine';
import { inject } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { ToasterService } from '../services/toaster.service';

/**
 * Guard to check if the user has a specific permission.
 * @param { PermissionsEnum } permission - Permission to check a user has.
 * @param { string } redirectPath - path to redirect to if a user does not have a given permission.
 * @returns { CanActivateFn } - Guard to check if the user has a specific permission.
 */
export function permissionGuard(
  permission: PermissionsEnum,
  redirectPath: string = '/'
): CanActivateFn {
  return (): boolean => {
    const router: Router = inject(Router);
    const permissions: PermissionsService = inject(PermissionsService);
    const toast: ToasterService = inject(ToasterService);

    if (!permissions.has(permission)) {
      toast.warn('You do not have permission to view this page.');
      router.navigateByUrl(redirectPath);
      return false;
    }

    return true;
  };
}
