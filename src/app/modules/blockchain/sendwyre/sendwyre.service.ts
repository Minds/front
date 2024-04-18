import { Injectable } from '@angular/core';
import { SendWyreConfig } from './sendwyre.interface';
import { SendWyreReservationResponse } from './wallet-order-reservation.interface';
import { Client } from '../../../services/api';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Service to handle redirection to SendWyre pay.
 * @author Ben Hayward
 */
@Injectable()
export class SendWyreService {
  // Amount to be purchased in USD.
  public amountUsd: string = '40';

  constructor(
    private client: Client,
    private toaster: ToasterService
  ) {}

  /**
   * Requests Wallet order reservation link to redirect to.
   * @param { SendWyreConfig } sendWyreConfig - parameters to pass to SendWyre.
   * @returns wallet order reservation link.
   */
  private async getRedirectUrl(
    sendWyreConfig: SendWyreConfig
  ): Promise<string> {
    try {
      const response: SendWyreReservationResponse = await this.client.post(
        'api/v2/sendwyre',
        sendWyreConfig
      );
      return response.url;
    } catch (e) {
      console.error(e);
      this.toaster.error(
        'An error has occurred whilst communicating with SendWyre'
      );
    }
  }

  /**
   * Redirects to SendWyre.
   * @param { SendWyreConfig } sendWyreConfig - parameters to pass to SendWyre.
   */
  public async redirect(sendWyreConfig: SendWyreConfig) {
    try {
      const redirectUrl: string = await this.getRedirectUrl(sendWyreConfig);
      // new tab with fallback for popup blockers
      window.open(redirectUrl, '_blank') ||
        window.location.replace(redirectUrl);
    } catch (e) {
      console.error(e);
      this.toaster.error('SendWyre baseUrl not configured');
    }
  }
}
