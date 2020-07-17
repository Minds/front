import { Injectable } from '@angular/core';
import { SupportTier } from '../../../../wire/v2/support-tiers.service';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../../../../common/api/api.service';

@Injectable()
export class ChannelShopMembershipsService {
  /**
   * Constructor
   * @param api
   */
  constructor(protected api: ApiService) {}

  /**
   * Deletes a Support Tier
   * @param supportTier
   */
  delete(supportTier: SupportTier): Observable<any> {
    return this.api.delete(
      `api/v3/wire/supporttiers/${encodeURIComponent(supportTier.urn)}`
    );
  }
}
