import WalletConnectProvider from '@walletconnect/ethereum-provider';
import WalletLink from 'walletlink';

export const createWeb3ModalConfig = () => {
  return {
    disableInjectedProvider: false,
    cacheProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: 'b76cba91dc954ceebff27244923224b1',
        },
      },
      walletlink: {
        package: WalletLink,
        options: {
          infuraUrl:
            'https://mainnet.infura.io/v3/b76cba91dc954ceebff27244923224b1',
          appName: 'Minds',
          appLogoUrl:
            'https://upload.wikimedia.org/wikipedia/commons/1/1d/Minds_logo.svg',
          darkMode: false,
        },
      },
    },
    network: '8453',
  };
};
