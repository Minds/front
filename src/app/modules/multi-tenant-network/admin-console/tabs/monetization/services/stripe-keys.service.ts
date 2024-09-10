import { Injectable } from '@angular/core';
import {
  GetSiteMembershipsGQL,
  GetSiteMembershipsQuery,
  GetStripeKeysGQL,
  GetStripeKeysQuery,
  SetStripeKeysGQL,
  SetStripeKeysMutation,
  SiteMembership,
  StripeKeysType,
} from '../../../../../../../graphql/generated.engine';
import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../common/services/toaster.service';
import { MutationResult } from 'apollo-angular';

/**
 * Service for managing Stripe keys.
 */
@Injectable({ providedIn: 'root' })
export class StripeKeysService {
  /** Stripe keys. */
  public readonly stripeKeys$: BehaviorSubject<StripeKeysType> =
    new BehaviorSubject<StripeKeysType>(null);

  /** Whether the service has been initialized. */
  public readonly initialized$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether a fetch is in progress. */

  public readonly fetchInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether the user has set Stripe keys. */
  public readonly hasSetStripeKeys$: Observable<boolean> =
    this.stripeKeys$.pipe(
      map((stripeKeys: StripeKeysType): boolean =>
        Boolean(stripeKeys?.pubKey && stripeKeys?.secKey)
      )
    );

  constructor(
    private getStripeKeysGQL: GetStripeKeysGQL,
    private setStripeKeyGQL: SetStripeKeysGQL,
    private getSiteMembershipsGQL: GetSiteMembershipsGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Fetches the Stripe keys - will both store them in local class state and return them directly.
   * @returns { Promise<StripeKeysType> } The Stripe keys.
   */
  public async fetchStripeKeys(): Promise<StripeKeysType> {
    this.fetchInProgress$.next(true);

    try {
      const response: ApolloQueryResult<GetStripeKeysQuery> =
        await lastValueFrom(
          this.getStripeKeysGQL.fetch(null, { fetchPolicy: 'network-only' })
        );
      const stripeKeys: StripeKeysType = response?.data?.stripeKeys;
      if (stripeKeys) {
        this.stripeKeys$.next(stripeKeys);
      }
      this.fetchInProgress$.next(false);
      this.initialized$.next(true);
      return stripeKeys;
    } catch (e) {
      console.error(e);
      this.toaster.error('An error occurred while loading your Stripe keys');
      this.fetchInProgress$.next(false);
    }
  }

  /**
   * Saves the Stripe keys.
   * @param { string } publicKey - The public key.
   * @param { string } secretKey - The secret key.
   * @returns { Promise<boolean> } Whether the keys were saved successfully.
   */
  public async saveStripeKeys(
    publicKey: string,
    secretKey: string
  ): Promise<boolean> {
    if (await this.hasNonExternalSiteMemberships()) {
      throw new Error(
        'Please archive all membership tiers related to the current Stripe public key before changing it.'
      );
    }

    const response: MutationResult<SetStripeKeysMutation> = await lastValueFrom(
      this.setStripeKeyGQL.mutate({
        pubKey: publicKey,
        secKey: secretKey,
      })
    );

    if (response.errors?.length) {
      throw new Error(response.errors[0].message ?? DEFAULT_ERROR_MESSAGE);
    }

    this.stripeKeys$.next({
      pubKey: publicKey,
      secKey: secretKey,
    });

    return true;
  }

  /**
   * Checks if there are any non-external site memberships.
   * @returns { Promise<boolean> } Whether there are any non-external site memberships.
   */
  private async hasNonExternalSiteMemberships(): Promise<boolean> {
    try {
      const response: ApolloQueryResult<GetSiteMembershipsQuery> =
        await lastValueFrom(this.getSiteMembershipsGQL.fetch());

      if (!response?.data?.siteMemberships?.length) {
        return false;
      }

      return response?.data?.siteMemberships?.some(
        (membership: SiteMembership) => !membership.isExternal
      );
    } catch (e) {
      console.error(e);
      return true;
    }
  }
}
