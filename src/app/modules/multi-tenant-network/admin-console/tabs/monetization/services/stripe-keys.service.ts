import { Injectable } from '@angular/core';
import {
  GetStripeKeysGQL,
  GetStripeKeysQuery,
  SetStripeKeysGQL,
  SetStripeKeysMutation,
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
  public readonly stripeKeys$: BehaviorSubject<
    StripeKeysType
  > = new BehaviorSubject<StripeKeysType>(null);

  /** Whether the service has been initialized. */
  public readonly initialized$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Whether a fetch is in progress. */

  public readonly fetchInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether the user has set Stripe keys. */
  public readonly hasSetStripeKeys$: Observable<
    boolean
  > = this.stripeKeys$.pipe(
    map((stripeKeys: StripeKeysType): boolean =>
      Boolean(stripeKeys?.pubKey && stripeKeys?.secKey)
    )
  );

  constructor(
    private getStripeKeysGQL: GetStripeKeysGQL,
    private setStripeKeyGQL: SetStripeKeysGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Fetches the Stripe keys - will both store them in local class state and return them directly.
   * @returns { Promise<StripeKeysType> } The Stripe keys.
   */
  public async fetchStripeKeys(): Promise<StripeKeysType> {
    this.fetchInProgress$.next(true);

    try {
      const response: ApolloQueryResult<GetStripeKeysQuery> = await lastValueFrom(
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
}
