import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { ChannelsV2Service } from '../../../../../../channels/v2/channels-v2.service';
import { BehaviorSubject } from 'rxjs';
import {
  MindsGroup,
  MindsUser,
} from '../../../../../../../interfaces/entities';
import {
  AddFeaturedEntityInputParams,
  AddFeaturedEntityModalEntityType,
} from './add-featured-entity-modal.types';

/**
 * Modal for the addition of featured entities. Will pass out chosen entity
 * through save intent. In future we will need to extend this class to add
 * group support. This could be done by having an alternative input when in
 * group mode.
 */
@Component({
  selector: 'm-networkAdminConsole__addFeaturedEntityModal',
  templateUrl: './add-featured-entity-modal.component.html',
  styleUrls: ['./add-featured-entity-modal.component.ng.scss'],
})
export class AddFeaturedEntityModalComponent {
  /** Form group. */
  public formGroup: FormGroup;

  /** Entity type to display suggestions for. */
  public entityType: AddFeaturedEntityModalEntityType =
    AddFeaturedEntityModalEntityType.User;

  /** Whether confirmation is in progress. */
  public readonly confirmInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  constructor(
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private channelService: ChannelsV2Service
  ) {
    this.formGroup = this.formBuilder.group({
      username: ['', { validators: [Validators.required] }],
    });
  }

  /**
   * Dismiss intent.
   * @returns { void }
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   * @param { MindsUser|MindsGroup } entity - entity to save.
   * @returns { void }
   */
  onSaveIntent: (entity: MindsUser | MindsGroup) => void = () => {};

  /**
   * Set modal data.
   * @param { AddFeaturedEntityInputParams } data - data for modal.
   * @returns { void }
   */
  public setModalData({
    onDismissIntent,
    onSaveIntent,
    entityType,
  }: AddFeaturedEntityInputParams): void {
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onSaveIntent =
      onSaveIntent ?? ((entity: MindsUser | MindsGroup) => {});
    this.entityType = entityType ?? AddFeaturedEntityModalEntityType.User;
  }

  /**
   * On confirm option click. Will check if user exists (to account
   * for manual typing without clicking the menu) and then pass back.
   * @returns { Promise<void> }
   */
  public async onConfirmClick(): Promise<void> {
    if (this.entityType === AddFeaturedEntityModalEntityType.Group) {
      this.toaster.warn('Group support is not yet implemented.');
      return;
    }

    const identifier: string = this.formGroup.get('username').value;

    if (!identifier?.length) {
      this.toaster.warn('You must enter a username.');
      return;
    }

    this.confirmInProgress$.next(true);

    let user: MindsUser;
    try {
      user = await this.channelService.getChannelByIdentifier(identifier);
    } catch (e) {
      console.error(e);
      user = null;
    }

    this.confirmInProgress$.next(false);

    if (!user) {
      this.toaster.warn('No user found with this username.');
      return;
    }

    this.onSaveIntent(user);
  }
}
