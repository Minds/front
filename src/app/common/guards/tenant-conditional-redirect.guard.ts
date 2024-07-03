import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';

/**
 * Conditionally redirect based on whether we are on a tenant network or not.
 *
 * Example usage:
 *
 * ```js
 * {
 *     path: '',
 *     pathMatch: 'full' as PathMatch,
 *     loadComponent: () => void 0,
 *     canActivate: [tenantConditionalRedirectGuard(
 *         '/discovery/latest',
 *         '/discovery/trending'
 *     )],
 * }
 * ```
 * @param { string } tenantPath - The path to redirect to if we are on a tenant network.
 * @param { string } nonTenantPath - The path to redirect to if we are not on a tenant network.
 * @returns { CanActivateFn } - CanActivateFn.
 */
export function tenantConditionalRedirectGuard(
  tenantPath: string,
  nonTenantPath: string
): CanActivateFn {
  return (): boolean => {
    inject(Router).navigate([
      inject(IS_TENANT_NETWORK) ? tenantPath : nonTenantPath,
    ]);
    return false;
  };
}
