import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrderReceivedModalService } from './order-received/order-received-modal.service';
import { TransakService } from './transak.service';
import { UniswapModalService } from './uniswap/uniswap-modal.service';

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
    private transakService: TransakService,
    private uniswapModalService: UniswapModalService,
    private orderReceivedModalService: OrderReceivedModalService
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
    if (this.paymentMethod === 'crypto') {
      await this.uniswapModalService.open();
    } else {
      try {
        const { status } = await this.transakService.open();
        await this.orderReceivedModalService.open({
          currency: status.fiatCurrency,
          tokenAmount: status.cryptoAmount,
          paymentAmount: status.amountPaid,
          paymentMethod: status.paymentOptionId.includes('card')
            ? 'Card'
            : 'Bank',
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
