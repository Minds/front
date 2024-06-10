import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Redirection guard - can be used in at module level to provide an external redirect.
 * Following advice from Vitalii Shevchuk @ https://stackoverflow.com/a/51059505
 */
@Injectable({ providedIn: 'root' })
export class RedirectGuard {
  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = route.data['externalUrl'];
    }
    return true;
  }
}
