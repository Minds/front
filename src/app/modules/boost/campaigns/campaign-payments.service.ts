import { Injectable } from '@angular/core';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { BoostContractService } from '../../blockchain/contracts/boost-contract.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { GetMetamaskComponent } from '../../blockchain/metamask/getmetamask.component';
import { Campaign, CampaignPayment } from './campaigns.type';

@Injectable()
export class CampaignPaymentsService {
  constructor(
    protected web3Wallet: Web3WalletService,
    protected boostContract: BoostContractService,
    protected overlayModal: OverlayModalService,
  ) {
  }

  calculateAmountDue(campaign: Campaign, isEditing: boolean): number {
    let amountDue: number = 0;

    if (!campaign || !campaign.budget) {
      return 0;
    }

    if (!isEditing) {
      amountDue = campaign.budget;
    } else if (campaign.original_campaign) {
      amountDue = campaign.budget - campaign.original_campaign.budget;
    }

    return amountDue > 0 ? amountDue : 0;
  }

  async pay(campaign: Campaign, amount: number): Promise<CampaignPayment> {
    return {
      address: '0x',
      txHash: '',
    };

    // await this.web3Wallet.ready();
    //
    // if (this.web3Wallet.isUnavailable()) {
    //   throw new Error('No Ethereum wallets available on your browser.');
    // }
    //
    // if (await this.web3Wallet.isLocal()) {
    //   const action = await this.web3Wallet.setupMetamask();
    //   switch (action) {
    //     case GetMetamaskComponent.ACTION_CREATE:
    //       // this.router.navigate(['/wallet']);
    //       this.overlayModal.dismiss();
    //       break;
    //     case GetMetamaskComponent.ACTION_CANCEL:
    //       return;
    //   }
    // }
    //
    // if (!(await this.web3Wallet.unlock())) {
    //   throw new Error('Your Ethereum wallet is locked or connected to another network.');
    // }
    //
    // return {
    //   address: await this.web3Wallet.getCurrentWallet(true) as string,
    //   txHash: await this.boostContract.create(campaign.client_guid, amount, campaign.checksum),
    // };
  }
}
