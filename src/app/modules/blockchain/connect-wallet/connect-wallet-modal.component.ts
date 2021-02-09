import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Web3WalletService } from '../web3-wallet.service';
import { ethers } from 'ethers';
import { Session } from '../../../services/session';
import { ApiService } from '../../../common/api/api.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { BehaviorSubject } from 'rxjs';

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

  set opts({ onDismissIntent, onComplete }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onComplete = onComplete || (() => {});
  }

  constructor(
    protected web3Wallet: Web3WalletService,
    protected session: Session,
    protected api: ApiService,
    protected toasterService: FormToastService
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

      // Non-metamask wallet require hashed byte messages, for some unknown reason
      const msgHash = ethers.utils.hashMessage(msg);
      const msgHashBytes = ethers.utils.arrayify(msgHash);

      // Non-metamask wallets will only have correct signature if msgHashBytes are used.
      const msgToSign =
        this.web3Wallet.getSigner().provider.connection.url === 'metamask'
          ? msg
          : msgHashBytes;

      const address = await this.web3Wallet.getSigner().getAddress();
      const signature = await this.web3Wallet
        .getSigner()
        .signMessage(msgToSign);

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
