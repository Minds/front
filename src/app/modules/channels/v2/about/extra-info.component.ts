import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';

/**
 * "Extra" info on the channel "about" page,
 * such as location, subs, badges, groups, join date.
 * Display location changes depending on screen width
 */
@Component({
  selector: 'm-channelAbout__extraInfo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'extra-info.component.html',
})
export class ChannelAboutExtraInfoComponent {
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
    const parts = `${dateStr}`.split('-').map(part => parseInt(part));

    if (parts.length !== 3) {
      return null;
    }

    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
  }

  /**
   * Determine whether to show the badges field
   */
  hasBadges(channel: any): boolean {
    const c = channel;
    return (
      c.pro ||
      c.plus ||
      c.is_admin ||
      c.verified ||
      c.founder ||
      (c.onchain_booster && c.onchain_booster * 1000 > Date.now())
    );
  }
}
