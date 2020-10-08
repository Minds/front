import {
  IProviderUserOptions,
  ThemeColors,
  getThemeColors,
  SimpleFunction,
} from '../helpers';
import { CONNECT_EVENT, ERROR_EVENT, CLOSE_EVENT } from '../constants';
import { themesList } from '../themes';
import { EventController, ProviderController } from '../controllers';
import { EventEmitter, Injectable } from '@angular/core';
import Fortmatic from 'fortmatic';
import WalletConnectProvider from '@walletconnect/web3-provider';

@Injectable()
export class Web3ModalService {
  private isOpen: boolean = false;
  private eventController: EventController = new EventController();
  private providerController: ProviderController;

  themeColors: ThemeColors;
  userOptions: IProviderUserOptions[];
  shouldOpen: EventEmitter<boolean> = new EventEmitter();
  lightboxOpacity: number;

  constructor() {}

  get cachedProvider(): string {
    return this.providerController.cachedProvider;
  }

  public async open() {
    this.lightboxOpacity = 0.4;
    this.themeColors = getThemeColors(themesList.default.name);

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
    await this.toggleModal();
  }

  public connect = (): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(CONNECT_EVENT, provider => resolve(provider));
      this.on(ERROR_EVENT, error => reject(error));
      this.on(CLOSE_EVENT, () => reject('Modal closed by user'));
      await this.toggleModal();
    });

  public connectTo = (id: string): Promise<any> =>
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

  public async toggleModal(): Promise<void> {
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

  public on(event: string, callback: SimpleFunction): SimpleFunction {
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

  public off(event: string, callback?: SimpleFunction): void {
    this.eventController.off({
      event,
      callback,
    });
  }

  public clearCachedProvider(): void {
    this.providerController.clearCachedProvider();
  }

  public setCachedProvider(id: string): void {
    this.providerController.setCachedProvider(id);
  }

  private _toggleModal = () => {
    const d = typeof window !== 'undefined' ? document : '';
    const body = d ? d.body || d.getElementsByTagName('body')[0] : '';
    if (body) {
      if (this.isOpen) {
        body.style.overflow = '';
      } else {
        body.style.overflow = 'hidden';
      }
    }
    console.log(this.shouldOpen, this.isOpen);
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

  close = () => {
    if (this.isOpen) {
      this._toggleModal();
    }
    this.eventController.trigger(CLOSE_EVENT);
  };
}
