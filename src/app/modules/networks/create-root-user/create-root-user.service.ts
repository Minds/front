import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, firstValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import {
  CreateTenantRootUserGQL,
  CreateTenantRootUserMutation,
  Tenant,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Service to create the network root user
 */
@Injectable()
export class NetworksCreateRootUserService {
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * The nework we're creating the root user for
   */
  public readonly network$: BehaviorSubject<Tenant> =
    new BehaviorSubject<Tenant>(null);

  constructor(
    private createTenantRootUserGQL: CreateTenantRootUserGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Submit the username and create the user
   * @param {string } username - the username for the root user
   * @returns { void  }
   */
  public async submitUsername(username: string): Promise<void> {
    this.inProgress$.next(true);
    try {
      const response = await this.createRootUser(username);
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
    }

    this.inProgress$.next(false);
  }

  /**
   * Create root user
   * @returns { Promise<MutationResult<CreateTenantRootUserMutation>> } - result of mutation for creating root user
   */
  private async createRootUser(
    username: string
  ): Promise<MutationResult<CreateTenantRootUserMutation>> {
    return firstValueFrom(
      this.createTenantRootUserGQL.mutate({
        networkUserInput: {
          username: username,
          tenantId: this.network$.getValue().id,
        },
      })
    );
  }
}
