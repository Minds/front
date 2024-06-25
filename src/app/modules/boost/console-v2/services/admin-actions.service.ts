import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import {
  AdminCancelBoostsGQL,
  AdminCancelBoostsMutation,
} from '../../../../../graphql/generated.engine';

/**
 * Service of helper functions to handle admin actions for boosts.
 */
@Injectable({ providedIn: 'root' })
export class BoostAdminActionsService {
  constructor(private adminCancelBoostsGQL: AdminCancelBoostsGQL) {}

  /**
   * Cancel/stop Boosts for the given entity GUID.
   * @param { string } entityGuid - entity guid.
   * @returns { Promise<void> }
   */
  public async cancelBoostsByEntityGuid(entityGuid: string): Promise<boolean> {
    try {
      const result: MutationResult<AdminCancelBoostsMutation> =
        await lastValueFrom(this.adminCancelBoostsGQL.mutate({ entityGuid }));
      return result?.data?.adminCancelBoosts;
    } catch (e) {
      console.error(e);
    }
  }
}
