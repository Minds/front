import Fortmatic from 'fortmatic';
import Torus from '@toruslabs/torus-embed';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Squarelink from 'squarelink';
import Portis from '@portis/web3';

interface WalletProviderKeys {
  fortmatic: string;
  portis: string;
  squarelink: string;
}
export const createWeb3ModalConfig = (
  walletProviderKeys?: WalletProviderKeys
) => {
  if (walletProviderKeys) {
    const { fortmatic, portis, squarelink } = walletProviderKeys;

    return {
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
};
