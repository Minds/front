import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';

/**
 * Central service that says whether we're
 * on a tenant site or minds.com
 */
@Injectable()
export class IsTenantService {
  isTenant: boolean;
  constructor(configs: ConfigsService) {
    this.isTenant = configs.get('is_tenant') || false;
  }

  public is(): boolean {
    return true;
    // ojm UNCOMMENT when ready
    // return this.isTenant;
  }
}
