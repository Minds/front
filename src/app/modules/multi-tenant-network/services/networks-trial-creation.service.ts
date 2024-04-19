import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {
  StartTenantTrialGQL,
  StartTenantTrialMutation,
} from '../../../../graphql/generated.engine';
import { MutationResult } from 'apollo-angular';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../common/services/toaster.service';
import { AutoLoginService } from '../../networks/auto-login.service';

/**
 * Service for starting a trial of a network.
 */
@Injectable({ providedIn: 'root' })
export class NetworksTrialCreationService {
  constructor(
    private router: Router,
    private startTenantTrialGql: StartTenantTrialGQL,
    private autoLoginService: AutoLoginService,
    private toaster: ToasterService
  ) {}

  /**
   * Start a network trial. Will redirect on success.
   * @returns { Promise<void> }
   */
  public async startTrial(): Promise<void> {
    try {
      const response: MutationResult<StartTenantTrialMutation> =
        await lastValueFrom(this.startTenantTrialGql.mutate());

      if (response.errors?.length) {
        console.error(response.errors);
        throw new Error(response.errors[0].message ?? DEFAULT_ERROR_MESSAGE);
      }

      if (!response?.data?.tenantTrial?.tenant?.id) {
        console.error('Response data is empty');
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      if (
        !response?.data?.tenantTrial?.loginUrl ||
        !response?.data?.tenantTrial?.jwtToken
      ) {
        this.toaster.warn(
          'An error occurred while logging you into your network.'
        );
        this.router.navigateByUrl('/networks');
        return;
      }

      await this.autoLoginService.openNetworkUrl(
        response.data.tenantTrial.loginUrl,
        response.data.tenantTrial.jwtToken,
        false
      );
    } catch (e) {
      this.toaster.error(e?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }
}
