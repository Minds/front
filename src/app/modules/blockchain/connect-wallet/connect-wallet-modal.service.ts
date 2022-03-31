import { Compiler, Injectable, Injector } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map, skipWhile, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { PhoneVerificationService } from '../../wallet/components/components/phone-verification/phone-verification.service';
import { WalletV2Service } from '../../wallet/components/wallet-v2.service';
import { ConnectWalletModalComponent } from './connect-wallet-modal.component';
import { ModalService } from '../../../services/ux/modal.service';
import { Web3WalletService } from '../web3-wallet.service';

@Injectable({ providedIn: 'root' })
export class ConnectWalletModalService {
  public isConnected$: Observable<boolean>;

  constructor(
    private modalService: ModalService,
    private compiler: Compiler,
    private injector: Injector,
    private phoneVerificationService: PhoneVerificationService,
    protected toasterService: FormToastService,
    protected api: ApiService,
    private walletService: WalletV2Service,
    private web3Wallet: Web3WalletService
  ) {
    if (!this.walletService.wallet.loaded) {
      this.walletService.loadWallet();
    }
    this.isConnected$ = this.walletService.wallet$.pipe(
      skipWhile(wallet => wallet.receiver.address === undefined),
      map(wallet => !!wallet.receiver.address),
      switchMap(hasAddress => {
        if (!hasAddress) {
          return of(false);
        }
        return this.api
          .get('api/v3/blockchain/unique-onchain')
          .pipe(map(response => response.unique));
      })
    );
  }

  async open(): Promise<string> {
    if (!this.web3Wallet.checkDeviceIsSupported()) {
      return null;
    }

    const { ConnectWalletModalModule } = await import(
      './connect-wallet-modal.module'
    );

    const onSuccess$: Subject<string> = new Subject();

    const modal = this.modalService.present(ConnectWalletModalComponent, {
      data: {
        onComplete: (address: string) => {
          onSuccess$.next(address);
          onSuccess$.complete(); // Ensures promise can be called below
          modal.close(address);
        },
      },
      animation: false,
      injector: this.injector,
      lazyModule: ConnectWalletModalModule,
    });

    await modal.result;
    return await onSuccess$.toPromise();
  }

  async joinRewards(onComplete: Function) {
    await this.phoneVerificationService.open();

    if (!this.phoneVerificationService.phoneVerified$.getValue()) {
      this.toasterService.error(
        'You must verify your phone number before connecting your wallet'
      );
      return;
    }

    await this.open();
    onComplete();
    await this.walletService.loadOffchainAndReceiver();
  }
}
