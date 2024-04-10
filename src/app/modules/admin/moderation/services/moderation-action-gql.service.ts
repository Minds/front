import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  ModerationDeleteEntityGQL,
  ModerationDeleteEntityMutation,
  ModerationSetUserBanStateGQL,
  ModerationSetUserBanStateMutation,
  PermissionsEnum,
} from '../../../../../graphql/generated.engine';
import { lastValueFrom } from 'rxjs';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../common/services/toaster.service';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Service to handle moderation actions through GQL, intended to be
 * used for tenant admins and moderators until the main-site moderation
 * system is migrated to MySQL.
 */
@Injectable({ providedIn: 'root' })
export class ModerationActionGqlService {
  constructor(
    private setUserBanStateGql: ModerationSetUserBanStateGQL,
    private deleteEntityGql: ModerationDeleteEntityGQL,
    private permissions: PermissionsService,
    private toaster: ToasterService
  ) {}

  /**
   * Set a users ban state.
   * @param { string } subjectGuid - the guid of the subject.
   * @param { boolean } banState - desired ban state for the subject.
   * @returns { boolean } true on success, false on failure.
   */
  public async setUserBanState(
    subjectGuid: string,
    banState: boolean = true
  ): Promise<boolean> {
    try {
      if (!this.permissions.has(PermissionsEnum.CanModerateContent)) {
        this.toaster.error('You do not have permission to set user ban state.');
        return;
      }

      const result: MutationResult<ModerationSetUserBanStateMutation> =
        await lastValueFrom(
          this.setUserBanStateGql.mutate({
            subjectGuid: subjectGuid,
            banState: banState,
          })
        );

      if (!result?.data?.setUserBanState) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      if (result?.errors?.length) {
        throw new Error(result.errors[0]?.message ?? DEFAULT_ERROR_MESSAGE);
      }

      this.toaster.success(
        `User successfully ${banState ? 'banned' : 'unbanned'}.`
      );
      return true;
    } catch (e) {
      console.error(e);
      this.toaster.error(
        'There was an error when updating this users ban state. Please try again later.'
      );
      return false;
    }
  }

  /**
   * Delete an entity.
   * @param { string } subjectUrn - the urn of the subject.
   * @returns { boolean } true on success, false on failure.
   */
  public async deleteEntity(subjectUrn: string): Promise<boolean> {
    try {
      if (!this.permissions.has(PermissionsEnum.CanModerateContent)) {
        this.toaster.error('You do not have permission to delete this entity.');
        return;
      }

      const result: MutationResult<ModerationDeleteEntityMutation> =
        await lastValueFrom(
          this.deleteEntityGql.mutate({ subjectUrn: subjectUrn })
        );

      if (!result?.data?.deleteEntity) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      if (result?.errors?.length) {
        throw new Error(result.errors[0]?.message ?? DEFAULT_ERROR_MESSAGE);
      }

      this.toaster.success(`Successfully deleted.`);
      return true;
    } catch (e) {
      console.error(e);
      this.toaster.error(
        'There was an error whilst deleting. Please try again later.'
      );
      return false;
    }
  }
}
