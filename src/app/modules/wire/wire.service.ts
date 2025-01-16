import { EventEmitter, Injectable } from '@angular/core';
import { Client } from '../../services/api/client';
import { WireContractService } from '../blockchain/contracts/wire-contract.service';
import { TokenContractService } from '../blockchain/contracts/token-contract.service';
import { Web3WalletService } from '../blockchain/web3-wallet.service';
import { BTCService } from '../payments/btc/btc.service';
import { ToasterService } from '../../common/services/toaster.service';
import { RestrictedAddressService } from '../wallet/components/restricted-address.service';

export type PayloadType =
  | 'onchain'
  | 'offchain'
  | 'usd'
  | 'eth'
  | 'erc20'
  | 'btc';

export interface WireStruc {
  amount: number | '';
  payloadType: PayloadType | null;
  guid: any;
  recurring: boolean;
  recurringInterval?: 'once' | 'monthly' | 'yearly' | 'lifetime' | null;
  payload: any;
  sourceEntityGuid?: string | null;
}

@Injectable()
export class WireService {
  public wireSent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private client: Client,
    private wireContract: WireContractService,
    private tokenContract: TokenContractService,
    private web3Wallet: Web3WalletService,
    private restrictedAddress: RestrictedAddressService,
    private btcService: BTCService,
    private toast: ToasterService
  ) {}

  async submitWire(wire: WireStruc) {
    let payload = wire.payload;

    if (!wire.amount || wire.amount < 0) {
      throw new Error('Amount should be a positive number');
    }

    switch (wire.payloadType) {
      case 'onchain':
        if (!this.web3Wallet.checkDeviceIsSupported()) {
          return;
        }
        if (this.web3Wallet.isUnavailable()) {
          throw new Error('No Ethereum wallets available on your browser.');
        } else if (!(await this.web3Wallet.unlock())) {
          throw new Error(
            'Your Ethereum wallet is locked or connected to another network.'
          );
        }

        if (
          payload.receiver == (await this.web3Wallet.getCurrentWallet(true))
        ) {
          throw new Error('You cannot wire yourself.');
        }

        try {
          // if (wire.recurring) {
          //   await this.tokenContract.increaseApproval(
          //     (await this.wireContract.wire()).address,
          //     wire.amount * 11,
          //     `We need you to pre-approve Minds Wire wallet for the recurring wire transactions.`
          //   );
          // }

          const address = await this.web3Wallet.getCurrentWallet(true);

          if (!address) {
            throw new Error('Unable to get address');
          }

          const isRestricted = await this.restrictedAddress
            .isRestricted(address)
            .toPromise();

          if (isRestricted) {
            throw new Error('Your address is restricted');
          }

          payload.address = address;
          payload.txHash = await (
            await this.tokenContract.token()
          ).transfer(
            payload.receiver,
            this.tokenContract.tokenToUnit(wire.amount)
          );

          payload.method = 'onchain';
        } catch (e) {
          console.error('[Wire/Token]', e);
          throw new Error(
            'Either you cancelled the approval, or there was an error processing it.'
          );
        }
        break;

      case 'eth':
        if (this.web3Wallet.isUnavailable()) {
          throw new Error('No Ethereum wallets available on your browser.');
        } else if (!(await this.web3Wallet.unlock())) {
          throw new Error(
            'Your Ethereum wallet is locked or connected to another network.'
          );
        }

        await this.web3Wallet.sendTransaction({
          from: await this.web3Wallet.getCurrentWallet(),
          to: payload.receiver,
          gasPrice: this.web3Wallet.toWei(2, 'gwei'),
          gasLimit: 21000,
          value: this.web3Wallet.toWei(wire.amount, 'ether').toString(),
          data: '0x',
        });
        break;

      case 'usd':
        payload.method = 'usd';
        break;

      case 'offchain':
        payload = { method: 'offchain', address: 'offchain' };
        break;

      case 'btc':
        this.btcService.showModal({
          amount: wire.amount,
          address: wire.payload.receiver,
        });
        return;
        break;
    }

    try {
      let response: any = await this.client.post(`api/v2/wire/${wire.guid}`, {
        payload,
        method: payload.method,
        amount: wire.amount,
        recurring: wire.recurring,
        source_entity_guid: wire.sourceEntityGuid,
        recurring_interval:
          wire.recurringInterval === 'lifetime'
            ? 'once'
            : wire.recurringInterval,
      });

      this.wireSent.next(wire);
      if (response && response.status && response.status === 'success') {
        const isMembership =
          wire.recurring &&
          (!wire.recurringInterval || wire.recurringInterval === 'monthly');

        const message = isMembership
          ? 'Recurring payment submitted successfully'
          : 'Wire submitted successfully';
        this.toast.success(message);
      }
      return { done: true };
    } catch (e) {
      if (e?.message) {
        this.toast.error(e.message);
      }

      if (e && e.stage === 'transaction') {
        throw new Error(
          'Sorry, your payment failed. Please, try again or use another card'
        );
      }

      throw e;
    }
  }
}
