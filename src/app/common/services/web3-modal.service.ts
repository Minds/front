import { EventEmitter, Injectable } from '@angular/core';
import Fortmatic from 'fortmatic';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {
  IProviderUserOptions,
  SimpleFunction,
  CONNECT_EVENT,
  ERROR_EVENT,
  CLOSE_EVENT,
  EventController,
  ProviderController,
} from '../../lib/web3modal';

@Injectable()
export class Web3ModalService {
  private isOpen: boolean = false;
  private eventController: EventController = new EventController();
  private providerController: ProviderController;

  userOptions: IProviderUserOptions[];
  shouldOpen: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.providerController = new ProviderController({
      disableInjectedProvider: false,
      cacheProvider: false,
      providerOptions: {
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: 'FORTMATIC_KEY', // required
          },
        },
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: 'INFURA_ID', // required
          },
        },
      },
      network: '',
    });

    this.providerController.on(CONNECT_EVENT, provider =>
      this.onConnect(provider)
    );
    this.providerController.on(ERROR_EVENT, error => this.onError(error));

    this.userOptions = this.providerController.getUserOptions();
    this.clearCachedProvider();
  }

  get cachedProvider(): string {
    return this.providerController.cachedProvider;
  }

  async open() {
    await this.toggleModal();
  }

  connect = (): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(CONNECT_EVENT, provider => resolve(provider));
      this.on(ERROR_EVENT, error => reject(error));
      this.on(CLOSE_EVENT, () => reject('Modal closed by user'));
      await this.toggleModal();
    });

  connectTo = (id: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(CONNECT_EVENT, provider => resolve(provider));
      this.on(ERROR_EVENT, error => reject(error));
      this.on(CLOSE_EVENT, () => reject('Modal closed by user'));
      const provider = this.providerController.getProvider(id);
      if (!provider) {
        return reject(
          new Error(
            `Cannot connect to provider (${id}), check provider options`
          )
        );
      }
      await this.providerController.connectTo(provider.id, provider.connector);
    });

  async toggleModal(): Promise<void> {
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
    this._toggleModal();
  }

  on(event: string, callback: SimpleFunction): SimpleFunction {
    this.eventController.on({
      event,
      callback,
    });

    return () =>
      this.eventController.off({
        event,
        callback,
      });
  }

  off(event: string, callback?: SimpleFunction): void {
    this.eventController.off({
      event,
      callback,
    });
  }

  clearCachedProvider(): void {
    this.providerController.clearCachedProvider();
  }

  setCachedProvider(id: string): void {
    this.providerController.setCachedProvider(id);
  }

  close = () => {
    if (this.isOpen) {
      this._toggleModal();
    }
    this.eventController.trigger(CLOSE_EVENT);
  };

  private _toggleModal = () => {
    this.shouldOpen.next(!this.isOpen);
    this.isOpen = !this.isOpen;
  };

  private onError = async (error: any) => {
    if (this.isOpen) {
      this._toggleModal();
    }
    this.eventController.trigger(ERROR_EVENT, error);
  };

  private onConnect = async (provider: any) => {
    if (this.isOpen) {
      this._toggleModal();
    }
    this.eventController.trigger(CONNECT_EVENT, provider);
  };
}
