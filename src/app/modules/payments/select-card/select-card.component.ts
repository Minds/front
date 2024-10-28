import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { NewCardModalComponent } from '../new-card-modal/new-card-modal.component';
import { firstValueFrom, Subscription } from 'rxjs';
import { ModalService } from '../../../services/ux/modal.service';
import {
  GiftCardProductIdEnum,
  PaymentMethod,
} from '../../../../graphql/generated.engine';
import { SelectCardService } from './select-card.service';

/**
 * Dropdown menu that allows users to choose from a list
 * of credit/debit cards that they've added already.
 *
 * Includes an option to add a new card,
 * which opens the <m-payments__newCardModal>
 *
 * See it by clicking 'tip' on a post > USD tab > Payment method
 */
@Component({
  selector: 'm-payments__selectCard',
  templateUrl: 'select-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectCardService],
})
export class PaymentsSelectCard {
  minds = (<any>window).Minds;
  @Output() selected: EventEmitter<string> = new EventEmitter();
  selectedSubscription: Subscription;
  inProgress = false;
  @Input('selected') paymentMethodId: string = '';
  @Input() paymentTotal: number = 0;
  @Input() giftCardProductIdEnum: GiftCardProductIdEnum | null = null;
  paymentMethods: PaymentMethod[] = [];

  constructor(
    public session: Session,
    public client: Client,
    public cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private modalService: ModalService,
    private selectCardService: SelectCardService
  ) {}

  ngOnInit() {
    this.loadCards();

    this.selectedSubscription = this.selected.subscribe((id) => {
      if (id === 'new') {
        this.onAddNewCard();
      }
    });
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe();
  }

  async loadCards() {
    this.inProgress = true;
    const paymentmethods = await firstValueFrom(
      this.selectCardService.loadCards(this.giftCardProductIdEnum)
    );
    this.paymentMethods = paymentmethods;

    const enoughCredits =
      paymentmethods.filter((paymentmethod: PaymentMethod) => {
        return (
          paymentmethod.id === 'gift_card' &&
          paymentmethod.balance >= this.paymentTotal
        );
      }).length > 0;

    if (enoughCredits) {
      // if user has enough Boost credits, select gift card payment.
      this.selected.next((this.paymentMethodId = 'gift_card'));
    } else {
      if (this.paymentMethodId && this.paymentMethodId !== 'gift_card') {
        // if user has a selected payment method already, select it.
        this.selected.next(this.paymentMethodId);
      } else if (paymentmethods && paymentmethods.length) {
        // else set the payment method to the first non-gift card payment method.
        for (const paymentMethod of paymentmethods) {
          if (paymentMethod.id !== 'gift_card') {
            this.paymentMethodId = paymentMethod.id;
            this.selected.next(this.paymentMethodId);
            break;
          }
        }
      }
    }
    this.inProgress = false;
    this.detectChanges();
  }

  async onAddNewCard(): Promise<void> {
    const modal = this.modalService.present(NewCardModalComponent, {
      data: {
        onComplete: () => {
          this.paymentMethodId = '';
          this.selected.next('');
          this.loadCards();
          modal?.close();
        },
        onDismissIntent: () => {
          this.paymentMethodId = '';
          this.selected.next('');
          modal?.close();
        },
      },
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
