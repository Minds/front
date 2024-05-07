import { Injectable } from '@angular/core';
import {
  CreatePersonalApiKeyGQL,
  CreatePersonalApiKeyMutation,
  DeletePersonalApiKeyGQL,
  GetPersonalApiKeysGQL,
  GetPersonalApiKeysQuery,
  GetPersonalApiKeysQueryVariables,
  PersonalApiKey,
  ApiScopeEnum,
  CreatePersonalApiKeyMutationVariables,
  DeletePersonalApiKeyMutation,
} from '../../../../../../graphql/generated.engine';
import { MutationResult, QueryRef } from 'apollo-angular';
import { Observable, catchError, firstValueFrom, map, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { ToasterService } from '../../../../../common/services/toaster.service';

/**
 * Service for management of personal API keys.
 */
@Injectable({ providedIn: 'root' })
export class PersonalApiKeysService {
  /** Query reference */
  private queryRef: QueryRef<
    GetPersonalApiKeysQuery,
    GetPersonalApiKeysQueryVariables
  >;

  /**
   * Observable of personal API keys.
   * @returns { Observable<PersonalApiKey[]> } The personal API keys.
   */
  get keys$(): Observable<PersonalApiKey[]> {
    if (!this.queryRef) {
      this.queryRef = this.getPersonalApiKeysGQL.watch(null, {
        fetchPolicy: 'no-cache',
      });
    }

    return this.queryRef.valueChanges.pipe(
      map(
        (result: ApolloQueryResult<GetPersonalApiKeysQuery>) =>
          result?.data?.listPersonalApiKeys
      ),
      catchError((e: unknown): Observable<PersonalApiKey[]> => {
        console.error(e);
        this.toaster.error(e);
        return of([]);
      })
    );
  }

  constructor(
    private getPersonalApiKeysGQL: GetPersonalApiKeysGQL,
    private createPersonalApiKeyGQL: CreatePersonalApiKeyGQL,
    private deletePersonalApiKeyGQL: DeletePersonalApiKeyGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Refetches the personal API keys.
   * @returns { void }
   */
  public refetch(): void {
    this.queryRef?.refetch();
  }

  /**
   * Creates a personal API key.
   * @param { CreatePersonalApiKeyMutationVariables } vars - The variables for the mutation.
   * @returns { Promise<PersonalApiKey> } The created personal API key.
   */
  public async create(
    vars: CreatePersonalApiKeyMutationVariables
  ): Promise<PersonalApiKey> {
    if (vars.expireInDays < 1) {
      console.warn('Invalid expireInDays value, setting to null');
      vars.expireInDays = null;
    }

    const response: MutationResult<CreatePersonalApiKeyMutation> =
      await firstValueFrom(this.createPersonalApiKeyGQL.mutate(vars));

    if (!response?.data?.createPersonalApiKey) {
      throw new Error('Failed to create personal API key');
    }

    return response.data.createPersonalApiKey;
  }

  /**
   * Deletes a personal API key by key id.
   * @param { string } keyId - The key ID.
   * @returns { Promise<void> }
   */
  public async delete(keyId: string): Promise<void> {
    const response: MutationResult<DeletePersonalApiKeyMutation> =
      await firstValueFrom(this.deletePersonalApiKeyGQL.mutate({ id: keyId }));

    if (!response?.data?.deletePersonalApiKey) {
      throw new Error('Failed to delete personal API key');
    }
  }
}
