import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';

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
   * @param session
   */
  constructor(public service: ChannelsV2Service, public session: Session) {}

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

  /**
   * Converts DOB date string into a Date object
   * @param dateStr
   */
  dobToDate(dateStr: string): Date {
    const parts = dateStr.split('-').map(part => parseInt(part));

    if (parts.length !== 3) {
      return null;
    }

    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
  }
}
