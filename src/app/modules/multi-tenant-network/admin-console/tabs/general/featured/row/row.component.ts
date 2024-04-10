import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DeleteFeaturedEntityGQL,
  DeleteFeaturedEntityMutation,
  FeaturedGroup,
  FeaturedUser,
  StoreFeaturedEntityGQL,
} from '../../../../../../../../graphql/generated.engine';
import { MutationResult } from 'apollo-angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { MindsAvatarObject } from '../../../../../../../common/components/avatar/avatar';
import * as _ from 'lodash';

/** Featured entity row option. */
enum FeaturedEntityRowOption {
  Featured,
  Member,
}

/**
 * Featured entity row component for display in a list.
 */
@Component({
  selector: 'm-networkAdminConsole__featuredEntityRow',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.ng.scss'],
})
export class NetworkAdminConsoleFeaturedEntityRowComponent {
  /** Featured entity to be displayed in row. */
  @Input() public featuredEntity: FeaturedUser | FeaturedGroup = null;

  /** Emits after call to delete entity - allows containing lists to respond by removing the entity. */
  @Output() public readonly onDeletion: EventEmitter<string> =
    new EventEmitter<string>();

  /** Enum for consumption in template. */
  public readonly FeaturedEntityRowOption: typeof FeaturedEntityRowOption =
    FeaturedEntityRowOption;

  /** Whether update action is in progres. */
  public readonly isUpdating$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether delete action is in progres. */
  public readonly isDeleting$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private deleteFeaturedEntityGQL: DeleteFeaturedEntityGQL,
    private storeFeaturedEntityGQL: StoreFeaturedEntityGQL,
    private toaster: ToasterService
  ) {}

  /**
   * Build avatar object to be passed to `minds-avatar` component.
   * @returns { MindsAvatarObject } object that can be displayed in `minds-avatar`.
   */
  public buildAvatarEntity(): MindsAvatarObject {
    return {
      guid: this.featuredEntity.entityGuid,
      type:
        this.featuredEntity.__typename === 'FeaturedUser' ? 'user' : 'group',
    };
  }

  /**
   * Called when the bell icon is pressed.
   * New users will be automatically opted in to post notifications from these channels.
   */
  public async onPostSubscriptionClick(): Promise<void> {
    try {
      this.isUpdating$.next(true);
      const result = await lastValueFrom(
        this.storeFeaturedEntityGQL.mutate({
          entityGuid: this.featuredEntity.entityGuid,
          autoSubscribe: this.featuredEntity.autoSubscribe,
          autoPostSubscription: !this.featuredEntity.autoPostSubscription,
        })
      );
    } catch (e) {
      console.error(e);
      this.toaster.error(e?.message ?? 'Please try again later.');
    } finally {
      this.isUpdating$.next(false);
    }
  }

  /**
   * Called on delete clicked on row. Will delete the entity from the DB.
   * In future we may want to make this function work with different chip badges
   * such that you can "delete" featured entities OR recommended entities.
   * @returns { Promise<void> }
   */
  public async onDeleteClicked(): Promise<void> {
    try {
      this.isDeleting$.next(true);
      const result: MutationResult<DeleteFeaturedEntityMutation> =
        await lastValueFrom(
          this.deleteFeaturedEntityGQL.mutate({
            entityGuid: this.featuredEntity.entityGuid,
          })
        );

      if (result.data?.deleteFeaturedEntity !== true) {
        throw new Error('Failed to make entity non-featured.');
      }

      this.onDeletion.emit(this.featuredEntity.entityGuid);
    } catch (e) {
      console.error(e);
      this.toaster.error(e?.message ?? 'Please try again later.');
    } finally {
      this.isDeleting$.next(false);
    }
  }

  /**
   * Navigate to the entity in a new tab.
   * @returns { void }
   */
  public navigateToEntity(): void {
    switch (this.featuredEntity.__typename) {
      case 'FeaturedUser':
        window.open(`/${this.featuredEntity.username}`, '_blank');
        break;
      case 'FeaturedGroup':
        window.open(`/group/${this.featuredEntity.entityGuid}`, '_blank');
        break;
    }
  }
}
