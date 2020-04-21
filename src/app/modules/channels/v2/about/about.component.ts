import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { MindsUser } from '../../../../interfaces/entities';

/**
 * Channel About component
 */
@Component({
  selector: 'm-channel__about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'about.component.html',
})
export class ChannelAboutComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelsV2Service) {}

  /**
   * Builds a payment methods list string
   * @param channel
   */
  getPaymentMethods(channel: MindsUser): string {
    const paymentMethods = [];

    // Check if user accepts USD
    if (channel.merchant && channel.merchant.id) {
      paymentMethods.push('USD');
    }

    // User will always accept Off-Chain tokens
    paymentMethods.push('Off-Chain Tokens');

    // Check if user accepts Ethereum currencies
    if (channel.eth_wallet) {
      paymentMethods.push('On-Chain Tokens', 'ETH');
    }

    // Check if user accepts Bitcoin
    if (channel.btc_address) {
      paymentMethods.push('BTC');
    }

    // Build the list
    return paymentMethods.join(', ').replace(/,(?!.*,)/gim, ' &');
  }
}
