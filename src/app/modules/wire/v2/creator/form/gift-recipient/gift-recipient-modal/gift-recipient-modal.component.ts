import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GiftCardProductIdEnum } from '../../../../../../../../graphql/generated.engine';
import {
  GiftRecipientGiftDuration,
  GiftRecipientModalInputParams,
} from './gift-recipient-modal.types';
import { GrowShrinkFast } from '../../../../../../../animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

/**
 * Modal that allows selection of a gift recipient.
 */
@Component({
  selector: 'm-giftRecipientModal',
  templateUrl: './gift-recipient-modal.component.html',
  styleUrls: ['./gift-recipient-modal.component.ng.scss'],
  animations: [GrowShrinkFast],
  host: {
    '(keyup.enter)': 'onConfirmRecipientClick()',
  },
})
export class GiftRecipientModalComponent {
  /** Product modal is for. */
  public product: GiftCardProductIdEnum;

  /** Duration that the gift is for. */
  public duration: GiftRecipientGiftDuration;

  /** Whether a user opts into sending a shareable link instead of targeting a user.  */
  public readonly sendShareableLink$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Form group. */
  public formGroup: FormGroup;

  constructor(
    private readonly toast: ToasterService,
    readonly formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      username: [
        '',
        {
          validators: [],
          updateOn: 'change',
        },
      ],
    });
  }

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   */
  onSaveIntent: (username: string, isSelfGift: boolean) => void = () => {};

  /**
   * Set modal data.
   * @param { GiftRecipientModalInputParams } data - data for modal.
   * @returns { void }
   */
  public setModalData({
    onDismissIntent,
    onSaveIntent,
    product,
    duration,
    recipientUsername,
    isSelfGift,
  }: GiftRecipientModalInputParams): void {
    this.product = product;
    this.duration = duration;
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onSaveIntent =
      onSaveIntent ?? ((username: string, isSelfGift: boolean) => {});

    if (isSelfGift) {
      this.sendShareableLink$.next(true);
    } else if (recipientUsername) {
      this.formGroup.get('username').setValue(recipientUsername);
    }
  }

  /**
   * On confirm recipient click, call save intent with appropriate parameters.
   * @returns { void }
   */
  public onConfirmRecipientClick(): void {
    let username: string = this.formGroup.get('username').value;
    const isSelfGift: boolean = this.sendShareableLink$.getValue();

    if (!username && !isSelfGift) {
      this.toast.error(
        'You must enter either a username or send yourself a shareable link'
      );
      return;
    }

    if (isSelfGift) {
      username = null;
    }

    this.onSaveIntent(
      username ? username.replace(/^\@+/, '') : null,
      isSelfGift
    );
  }

  /**
   * Get appropriate subtitle for product.
   * @returns { string } subtitle for product.
   */
  public getSubtitle(): string {
    switch (this.product) {
      case GiftCardProductIdEnum.Plus:
        if (this.duration === GiftRecipientGiftDuration.YEAR) {
          return $localize`:@@GIFT_RECIPIENT_MODAL__GIFT_PLUS_YEAR:Give the gift of a Minds+ subscription for 1 year.`;
        }
        return $localize`:@@GIFT_RECIPIENT_MODAL__GIFT_PLUS_MONTH:Give the gift of a Minds+ subscription for 1 month.`;
      case GiftCardProductIdEnum.Pro:
        if (this.duration === GiftRecipientGiftDuration.YEAR) {
          return $localize`:@@GIFT_RECIPIENT_MODAL__GIFT_PRO_YEAR:Give the gift of a Minds Pro subscription for 1 year.`;
        }
        return $localize`:@@GIFT_RECIPIENT_MODAL__GIFT_PRO_MONTH:Give the gift of a Minds Pro subscription for 1 month.`;
      default:
        throw new Error('Unsupported product type: ' + this.product);
    }
  }

  /**
   * On shareable link toggle change.
   * @param { boolean } $event - shareable link toggle change event.
   * @returns { void }
   */
  public onShareableLinkToggleChange($event: boolean): void {
    this.sendShareableLink$.next($event);
  }
}
