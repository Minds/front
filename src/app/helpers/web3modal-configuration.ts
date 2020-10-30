import WalletConnectProvider from '@walletconnect/web3-provider';
import Authereum from 'authereum';

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
      authereum: {
        package: Authereum,
      },
    },
    network: '',
  };
};
