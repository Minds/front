import { Compiler, Injectable, Injector } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  share,
  shareReplay,
  skipWhile,
  switchMap,
} from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { PhoneVerificationService } from '../../wallet/components/components/phone-verification/phone-verification.service';
import { WalletV2Service } from '../../wallet/components/wallet-v2.service';
import { ConnectWalletModalComponent } from './connect-wallet-modal.component';
import { ModalService } from '../../../services/ux/modal.service';
import { Web3WalletService } from '../web3-wallet.service';
import { EmailConfirmationService } from '../../../common/components/email-confirmation/email-confirmation.service';

@Injectable({ providedIn: 'root' })
export class ConnectWalletModalService {
  public isConnected$: Observable<boolean>;

  constructor(
    private modalService: ModalService,
    private compiler: Compiler,
    private injector: Injector,
    private phoneVerificationService: PhoneVerificationService,
    protected toasterService: ToasterService,
    protected api: ApiService,
    private walletService: WalletV2Service,
    private web3Wallet: Web3WalletService,
    private emailConfirmation: EmailConfirmationService
  ) {
    if (!this.walletService.wallet.loaded) {
      // We should not need to do mutliple calls
      // this.walletService.loadWallet();
    }
    this.isConnected$ = this.walletService.wallet$.pipe(
      skipWhile((wallet) => wallet.receiver.address === undefined),
      map((wallet) => !!wallet.receiver.address),
      distinctUntilChanged(),
      switchMap((hasAddress) => {
        if (!hasAddress) {
          return of(false);
        }
        return this.api
          .get('api/v3/blockchain/unique-onchain')
          .pipe(map((response) => response.unique));
      }),
      shareReplay()
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
    if (!this.emailConfirmation.ensureEmailConfirmed()) return;

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
