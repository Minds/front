import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { Session } from '../../services/session';

/**
 * Guard to verify that the user is an admin.
 * @param { string } redirectPath - path to redirect to if a user is not an admin.
 * @returns { CanActivateFn } - Guard to verify that the user is an admin.
 */
export function adminOnlyGuard(redirectPath: string = '/'): CanActivateFn {
  return (): boolean => {
    if (!inject(Session).isAdmin()) {
      inject(ToasterService).warn(
        'You do not have permission to view this page.'
      );
      inject(Router).navigateByUrl(redirectPath);
      return false;
    }
    return true;
  };
}
