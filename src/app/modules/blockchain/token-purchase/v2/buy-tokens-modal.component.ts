import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { PhoneVerificationService } from '../../../wallet/components/components/phone-verification/phone-verification.service';
import { OrderReceivedModalService } from './order-received/order-received-modal.service';
import { UniswapModalService } from './uniswap/uniswap-modal.service';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';

type PaymentMethod = 'card' | 'bank' | 'crypto' | '';

@Component({
  selector: 'm-buyTokens__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'buy-tokens-modal.component.html',
  styleUrls: ['./buy-tokens-modal.component.ng.scss'],
})
export class BuyTokensModalComponent {
  terms: boolean = false;
  paymentMethod: PaymentMethod = 'card';

  constructor(
    private uniswapModalService: UniswapModalService,
    private orderReceivedModalService: OrderReceivedModalService,
    private session: Session,
    private phoneVerificationService: PhoneVerificationService,
    private toasterService: ToasterService,
    private emailConfirmation: EmailConfirmationService
  ) {}

  canContinue() {
    return this.terms && this.paymentMethod;
  }

  choosePaymentMethod(paymentMethod: PaymentMethod) {
    if (paymentMethod === this.paymentMethod) {
      this.paymentMethod = '';
    } else {
      this.paymentMethod = paymentMethod;
    }
  }

  async openPaymentModal() {
    if (!this.session.getLoggedInUser().rewards) {
      if (!this.emailConfirmation.ensureEmailConfirmed()) return;

      await this.phoneVerificationService.open();

      const hasPhoneNumber = this.phoneVerificationService.phoneVerified$.getValue();

      if (!hasPhoneNumber) {
        this.toasterService.error(
          'You must confirm your phone number in order to purchase tokens'
        );
        return;
      }
    }

    if (this.paymentMethod === 'crypto') {
      await this.uniswapModalService.open();
    } else {
      this.toasterService.error('Not currently supported');
    }
  }

  setModalData() {}
}
