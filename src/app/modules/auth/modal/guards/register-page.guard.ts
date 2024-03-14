import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { IsTenantService } from '../../../../common/services/is-tenant.service';
import { MetaService } from '../../../../common/services/meta.service';
import { SiteService } from '../../../../common/services/site.service';
import { HORIZONTAL_LOGO_PATH as TENANT_HORIZONTAL_LOGO } from '../../../multi-tenant-network/services/config-image.service';

/**
 * A hacky way to set up tenant SEO fields on the register page
 * It's not really a 'guard' because it always returns true
 */
@Injectable()
export class RegisterPageGuard implements CanActivate {
  constructor(
    private isTenant: IsTenantService,
    private metaService: MetaService,
    private site: SiteService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.metaService
      .setTitle(
        this.isTenant.is()
          ? `Join us on ${this.site.title}`
          : 'Join Minds, and Elevate the Conversation',
        false
      )
      .setDescription(
        this.isTenant.is()
          ? `A social app.`
          : 'Minds is an open source social network dedicated to Internet freedom. Speak freely, protect your privacy, earn crypto rewards and take back control of your social media.'
      )
      .setOgImage(
        this.isTenant.is()
          ? TENANT_HORIZONTAL_LOGO
          : '/assets/og-images/default-v3.png',
        {
          width: 1200,
          height: 1200,
        }
      );
    // Always return true
    return true;
  }
}
