import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';
import {
  MindsGroup,
  MindsUser,
} from '../../../../../../../interfaces/entities';
import {
  AddFeaturedEntityInputParams,
  AddFeaturedEntityModalEntityType,
} from './add-featured-entity-modal.types';
import { AutoCompleteEntityTypeEnum } from '../../../../../../../common/components/forms/autocomplete-entity-input/autocomplete-entity-input.component';

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

  /** Enum of featured entity types for modal */
  public readonly AddFeaturedEntityModalEntityType: typeof AddFeaturedEntityModalEntityType = AddFeaturedEntityModalEntityType;

  /** Enum of auto-completable entities for use in modal */
  public readonly AutoCompleteEntityTypeEnum: typeof AutoCompleteEntityTypeEnum = AutoCompleteEntityTypeEnum;

  /** Entity type to display suggestions for. */
  public entityType: AddFeaturedEntityModalEntityType =
    AddFeaturedEntityModalEntityType.User;

  /** Whether confirmation is in progress. */
  public readonly confirmInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  constructor(
    private toaster: ToasterService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      entity: ['', { validators: [Validators.required] }],
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
   * On confirm option click.
   * @returns { Promise<void> }
   */
  public async onConfirmClick(): Promise<void> {
    const entity: MindsGroup | MindsUser = this.formGroup.get('entity').value;

    if (!entity) {
      this.toaster.warn('An entity must be selected');
      return;
    }

    this.onSaveIntent(entity);
  }
}
