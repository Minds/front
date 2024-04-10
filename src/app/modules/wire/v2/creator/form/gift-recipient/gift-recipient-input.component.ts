import { Component, OnDestroy, OnInit } from '@angular/core';
import { WireV2Service } from '../../../wire-v2.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GiftRecipientModalLazyService } from './gift-recipient-modal/gift-recipient-modal-lazy.service';
import { GiftRecipientGiftDuration } from './gift-recipient-modal/gift-recipient-modal.types';
import { GiftCardProductIdEnum } from '../../../../../../../graphql/generated.engine';

/**
 * Gift card recipient input button - will trigger a modal to open allowing selection and
 * update with selected option.
 */
@Component({
  selector: 'm-wireCreator__giftRecipientInput',
  templateUrl: 'gift-recipient-input.component.html',
  styleUrls: ['gift-recipient-input.component.ng.scss'],
  host: {
    '(click)': 'onRecipientInputClick()',
  },
})
export class WireCreatorGiftRecipientInputComponent
  implements OnInit, OnDestroy
{
  /** Set recipient username. */
  public readonly recipientUsername$: BehaviorSubject<string> =
    this.service.giftRecipientUsername$;

  /** Set whether the user has opted to create a self gift, allowing them to give the code out themselves. */
  public readonly isSelfGift$: BehaviorSubject<boolean> =
    this.service.isSelfGift$;

  // subscriptions.
  private giftRecipientUsernameSubscription: Subscription;
  private giftRecipientSelfGiftSubscription: Subscription;

  constructor(
    public service: WireV2Service,
    public giftRecipientModal: GiftRecipientModalLazyService
  ) {}

  ngOnInit(): void {
    this.giftRecipientUsernameSubscription =
      this.giftRecipientModal.username$.subscribe((username) => {
        this.service.setGiftRecipientUsername(username);
      });
    this.giftRecipientSelfGiftSubscription =
      this.giftRecipientModal.isSelfGift$.subscribe((isSelfGift) => {
        this.service.setIsSelfGift(isSelfGift);
      });
  }

  ngOnDestroy(): void {
    this.giftRecipientUsernameSubscription?.unsubscribe();
    this.giftRecipientSelfGiftSubscription?.unsubscribe();
  }

  /**
   * On recipient input click, open gift recipient modal
   * with appropriate inputs.
   * @returns { void }
   */
  public onRecipientInputClick(): void {
    let product: GiftCardProductIdEnum;
    let duration: GiftRecipientGiftDuration;

    switch (this.service.upgradeType$.getValue()) {
      case 'plus':
        product = GiftCardProductIdEnum.Plus;
        break;
      case 'pro':
        product = GiftCardProductIdEnum.Pro;
        break;
      default:
        throw new Error(
          'Unsupported upgrade type: ' + this.service.upgradeType$.getValue()
        );
    }

    switch (this.service.upgradeInterval$.getValue()) {
      case 'monthly':
        duration = GiftRecipientGiftDuration.MONTH;
        break;
      case 'yearly':
        duration = GiftRecipientGiftDuration.YEAR;
        break;
      default:
        throw new Error(
          'Unsupported upgrade interval: ' +
            this.service.upgradeInterval$.getValue()
        );
    }

    this.giftRecipientModal.open(
      product,
      duration,
      this.recipientUsername$.getValue() ?? null,
      this.isSelfGift$.getValue() ?? null
    );
  }
}
