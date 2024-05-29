import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ConfigsService } from '../services/configs.service';
import { ToasterService } from '../services/toaster.service';

/**
 * Guard to check if Boost is enabled
 * @param { string } redirectPath - path to redirect to if boost is not enabled.
 * @returns { CanActivateFn } - Guard to check if boost is enabled.
 */
export function boostEnabledGuard(redirectPath: string = '/'): CanActivateFn {
  return (): boolean => {
    const tenantConfig = inject(ConfigsService).get('tenant') ?? null;

    if (tenantConfig && !tenantConfig['boost_enabled']) {
      inject(ToasterService).warn('Boosting is not currently enabled');
      inject(Router).navigateByUrl(redirectPath);
      return false;
    }

    return true;
  };
}
