import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, firstValueFrom } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import {
  CreateNetworkRootUserGQL,
  CreateNetworkRootUserMutation,
  Tenant,
} from '../../../../graphql/generated.engine';

/**
 * Service to create the network root user
 */
@Injectable()
export class NetworksCreateRootUserService {
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * The nework we're creating the root user for
   */
  public readonly network$: BehaviorSubject<Tenant> = new BehaviorSubject<
    Tenant
  >(null);

  constructor(private createNetworkRootUserGQL: CreateNetworkRootUserGQL) {}

  /**
   * Submit the username and create the user
   * @param {string } username - the username for the root user
   * @returns { void  }
   */
  public submitUsername(username: string): void {
    this.inProgress$.next(true);
    try {
      this.createRootUser(username);
    } catch (e) {
      console.error(e);
    }

    this.inProgress$.next(false);
  }

  /**
   * Create root user
   * @returns { Promise<MutationResult<CreateNetworkRootUserMutation>> } - result of mutation for creating root user
   */
  private async createRootUser(
    username: string
  ): Promise<MutationResult<CreateNetworkRootUserMutation>> {
    return firstValueFrom(
      this.createNetworkRootUserGQL.mutate({
        networkUserInput: {
          username: username,
          tenantId: this.network$.getValue().id,
        },
      })
    );
  }
}
