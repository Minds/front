import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { MultiTenantNetworkConfigService } from './config.service';
import * as _ from 'lodash';

/**
 * Service that handles updating the tenants custom script.
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantCustomScriptInputService {
  constructor(
    private apiService: ApiService,
    private multiTenantNetworkConfigService: MultiTenantNetworkConfigService
  ) {}

  /**
   * Updates the tenants custom script.
   * @param { string } customScript - The new custom script value.
   * @returns { Promise<boolean> } Whether the update was successful.
   */
  public async updateCustomScript(customScript: string): Promise<boolean> {
    const response: ApiResponse = await lastValueFrom(
      this.apiService.put('api/v3/multi-tenant/configs/custom-script', {
        customScript: _.escape(customScript),
      })
    );

    if (response?.status !== 'success') {
      return false;
    }

    this.multiTenantNetworkConfigService.updateLocalState({ customScript });
    return true;
  }
}
