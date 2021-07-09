import { Compiler, Injectable, Injector } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map, skipWhile, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../services/ux/stackable-modal.service';
import { PhoneVerificationService } from '../../wallet/components/components/phone-verification/phone-verification.service';
import { WalletV2Service } from '../../wallet/components/wallet-v2.service';
import { ConnectWalletModalComponent } from './connect-wallet-modal.component';

@Injectable({ providedIn: 'root' })
export class ConnectWalletModalService {
  public isConnected$: Observable<boolean>;

  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector,
    private phoneVerificationService: PhoneVerificationService,
    protected toasterService: FormToastService,
    protected api: ApiService,
    private walletService: WalletV2Service
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
    const { ConnectWalletModalModule } = await import(
      './connect-wallet-modal.module'
    );

    const moduleFactory = await this.compiler.compileModuleAsync(
      ConnectWalletModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<string> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(ConnectWalletModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        onComplete: (address: string) => {
          onSuccess$.next(address);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

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
