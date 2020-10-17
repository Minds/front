import { Compiler, Injectable, Injector } from '@angular/core';
import Fortmatic from 'fortmatic';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Squarelink from 'squarelink';
import Portis from '@portis/web3';
import Torus from '@toruslabs/torus-embed';

import {
  CONNECT_EVENT,
  ERROR_EVENT,
  IProviderControllerOptions,
  Web3WalletConnector,
} from '@dorgtech/web3-wallet-connector';
import { ConfigsService } from '../../../common/services/configs.service';
import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../../services/ux/stackable-modal.service';
import { Subject } from 'rxjs';
import { Web3ModalComponent } from './web3-modal.component';

@Injectable()
export class Web3ModalService {
  private web3WalletConnector: Web3WalletConnector;

  constructor(
    private compiler: Compiler,
    private configs: ConfigsService,
    private injector: Injector,
    private stackableModal: StackableModalService
  ) {
    const walletProviderKeys = this.configs.get('blockchain')
      .wallet_provider_keys;

    if (walletProviderKeys) {
      const { fortmatic, portis, squarelink } = walletProviderKeys;

      this.web3WalletConnector = new Web3WalletConnector({
        disableInjectedProvider: false,
        cacheProvider: false,
        providerOptions: {
          fortmatic: {
            package: Fortmatic,
            options: {
              key: fortmatic,
            },
          },
          torus: {
            package: Torus,
          },
          portis: {
            package: Portis,
            options: {
              id: portis,
            },
          },
          squarelink: {
            package: Squarelink,
            options: {
              id: squarelink,
            },
          },
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: 'INFURA_ID',
            },
          },
        },
        network: '',
      });
    } else {
      this.web3WalletConnector = new Web3WalletConnector();
    }
  }

  async open() {
    const providers = this.web3WalletConnector.providers;
    console.log(providers);

    const { Web3ModalModule } = await import('./web3-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      Web3ModalModule
    );

    const moduleRef = moduleFactory.create(this.injector);

    moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(Web3ModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        providers,
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    this.web3WalletConnector.providerController.on(CONNECT_EVENT, provider => {
      onSuccess$.next(provider);
      onSuccess$.complete();
      this.stackableModal.dismiss();
    });

    this.web3WalletConnector.providerController.on(ERROR_EVENT, error => {
      console.error(error);
      this.stackableModal.dismiss();
    });

    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'Dismissed modal';
    }

    return onSuccess$.toPromise();
  }

  setConfiguration(options: IProviderControllerOptions) {
    this.web3WalletConnector.setConfiguration(options);
  }

  clearCachedProvider(): void {
    this.web3WalletConnector.providerController.clearCachedProvider();
  }

  setCachedProvider(id: string): void {
    this.web3WalletConnector.providerController.setCachedProvider(id);
  }
}
