import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { ethers } from 'ethers';
import { Session } from '../../../services/session';
import { ApiService } from '../../../common/api/api.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';

/**
 * "In progress" modal that appears when you've clicked on
 * a wallet option in the web3modal
 * but haven't yet completed the signature.
 */
@Component({
  selector: 'm-connectWallet__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'connect-wallet-modal.component.html',
  styleUrls: ['./connect-wallet-modal.component.ng.scss'],
})
export class ConnectWalletModalComponent {
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  onDismissIntent: () => void = () => {};

  onComplete: (result: string) => void = () => {};

  setModalData({ onDismissIntent, onComplete }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onComplete = onComplete || (() => {});
  }

  constructor(
    protected web3Wallet: Web3WalletService,
    protected session: Session,
    protected api: ApiService,
    protected toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.connect();
  }

  async connect(): Promise<void> {
    this.inProgress$.next(true);

    try {
      await this.web3Wallet.getCurrentWallet(true);

      const msg = JSON.stringify({
        user_guid: this.session.getLoggedInUser().guid,
        unix_ts: Math.round(Date.now() / 1000),
      });

      const provider = this.web3Wallet.provider;
      const signer = await this.web3Wallet.getSigner();
      const address = await signer.getAddress();
      const msgHashBytes = ethers.toUtf8Bytes(msg);

      const signature = await provider.send('personal_sign', [
        ethers.hexlify(msgHashBytes),
        address.toLowerCase(),
      ]);

      const response = await (<any>this.api.post(
        'api/v3/blockchain/unique-onchain/validate',
        {
          signature,
          payload: msg,
          address: address,
        }
      )).toPromise();

      if (response.status === 'success') {
        this.toasterService.success(
          'Your address is now connected and verified'
        );
      }

      this.onComplete(address);
    } catch (err) {
      this.toasterService.error(err?.message);
      this.onDismissIntent();
    } finally {
      this.inProgress$.next(false);
    }
  }
}
