import { Compiler, EventEmitter, Injectable, Injector } from '@angular/core';
import Fortmatic from 'fortmatic';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Squarelink from 'squarelink';
import Portis from '@portis/web3';
import Torus from '@toruslabs/torus-embed';

import {
  IProviderUserOptions,
  CONNECT_EVENT,
  ERROR_EVENT,
  ProviderController,
  IProviderControllerOptions,
} from '../../../lib/web3modal';
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
  private defaultOptions: IProviderControllerOptions;
  private providerController: ProviderController;
  private userOptions: IProviderUserOptions[];

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

      this.defaultOptions = {
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
      };
    }
  }

  get cachedProvider(): string {
    return this.providerController.cachedProvider;
  }

  setConfiguration = (options?: IProviderControllerOptions): void => {
    if (options) {
      this.providerController = new ProviderController(options);
    } else {
      this.providerController = new ProviderController(this.defaultOptions);
    }

    this.clearCachedProvider();

    this.userOptions = this.providerController.getUserOptions();
  };

  async open() {
    if (!this.providerController) {
      this.setConfiguration();
    }

    const { Web3ModalModule } = await import('./web3-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      Web3ModalModule
    );

    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(Web3ModalComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        providers: this.userOptions,
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    this.providerController.on(CONNECT_EVENT, provider => {
      onSuccess$.next(provider);
      onSuccess$.complete();
      this.stackableModal.dismiss();
    });

    this.providerController.on(ERROR_EVENT, error => {
      console.error(error);
      this.stackableModal.dismiss();
    });

    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'Dismissed modal';
    }

    return onSuccess$.toPromise();
  }

  async checkIfCachedProviderOrSingleOption(): Promise<void> {
    if (this.cachedProvider) {
      await this.providerController.connectToCachedProvider();
      return;
    }
    if (
      this.userOptions &&
      this.userOptions.length === 1 &&
      this.userOptions[0].name
    ) {
      await this.userOptions[0].onClick();
      return;
    }
  }

  clearCachedProvider(): void {
    this.providerController.clearCachedProvider();
  }

  setCachedProvider(id: string): void {
    this.providerController.setCachedProvider(id);
  }
}
