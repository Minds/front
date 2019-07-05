import { Injectable } from '@angular/core';
import { Web3WalletService } from '../../blockchain/web3-wallet.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { GetMetamaskComponent } from '../../blockchain/metamask/getmetamask.component';
import { Campaign, CampaignPayment } from './campaigns.type';
import { TokenContractService } from '../../blockchain/contracts/token-contract.service';

@Injectable()
export class CampaignPaymentsService {
  campaignWallet: string;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected tokenContract: TokenContractService,
    protected overlayModal: OverlayModalService,
  ) {
    this.campaignWallet = window.Minds.blockchain.boost_campaigns_wallet_address;
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
    await this.web3Wallet.ready();

    if (this.web3Wallet.isUnavailable()) {
      throw new Error('No Ethereum wallets available on your browser.');
    } else if (!this.campaignWallet) {
      throw new Error('Campaign Wallet is not setup.');
    }

    if (await this.web3Wallet.isLocal()) {
      const action = await this.web3Wallet.setupMetamask();
      switch (action) {
        case GetMetamaskComponent.ACTION_CREATE:
          // this.router.navigate(['/wallet']);
          this.overlayModal.dismiss();
          break;
        case GetMetamaskComponent.ACTION_CANCEL:
          return;
      }
    }

    if (!(await this.web3Wallet.unlock())) {
      throw new Error('Your Ethereum wallet is locked or connected to another network.');
    }

    return {
      address: await this.web3Wallet.getCurrentWallet(true) as string,
      txHash: await this.tokenContract.transfer(this.campaignWallet, amount),
      amount,
    };
  }
}
