import { Injectable } from '@angular/core';
import transakSDK from '@transak/transak-sdk';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Web3WalletService } from '../../web3-wallet.service';

interface TransakResponse {
  eventName: string;
  status: {
    amountPaid: number;
    autoExpiresAt: string;
    conversionPrice: number;
    createdAt: string;
    cryptoAmount: number;
    cryptoCurrency: string;
    cryptocurrency: string;
    fiatAmount: number;
    fiatCurrency: string;
    fromWalletAddress: string;
    id: string;
    isBuyOrSell: string;
    network: string;
    paymentOptionId: string;
    walletLink: string;
  };
}

@Injectable()
export class TransakService {
  protected apiKey: string;
  protected environment: string;

  constructor(
    private web3WalletService: Web3WalletService,
    private configService: ConfigsService
  ) {
    this.apiKey = this.configService.get('blockchain').transak?.api_key;
    this.environment = this.configService.get(
      'blockchain'
    ).transak?.environment;
  }

  async open(): Promise<TransakResponse> {
    const address = await this.web3WalletService.getCurrentWallet(true);

    let transak = new transakSDK({
      apiKey: this.apiKey || '4fcd6904-706b-4aff-bd9d-77422813bbb7',
      environment: this.environment || 'STAGING',
      defaultCryptoCurrency: 'ETH',
      walletAddress: address,
      themeColor: '000000',
      hostURL: window.location.origin,
      widgetHeight: '650px',
      widgetWidth: '350px',
    });

    return await new Promise((resolve, reject) => {
      transak.init();

      transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, error => {
        reject(error);
      });

      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
        resolve(orderData);
        transak.close();
      });
    });
  }
}
