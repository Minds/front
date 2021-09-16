import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../../common/api/api.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { ethers } from 'ethers';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { MainnetChain } from '@skalenetwork/ima-js';

/**
 * Handles the getting of a users withdrawals summary from the server.
 */
@Injectable({ providedIn: 'root' })
export class SkaleService {
  private provider;

  private chainIds = {
    skale: '0x466ec1d61bcef',
    rinkeby: '0x4',
  };

  private rpcUrl = 'https://dappnet-api.skalenodes.com/v1/glamorous-syrma';
  private depositBoxAddress = RINKEBY_ABIS.deposit_box_erc20_address;
  private depositBoxAbi = RINKEBY_ABIS.deposit_box_erc20_abi;
  private skaleChainName = 'glamorous-syrma';

  // actually rinkeby
  private tokenAddressMainnet = '0xf5f7ad7d2c37cae59207af43d0beb4b361fb9ec8';

  constructor(
    private api: ApiService,
    private toast: FormToastService,
    private web3Wallet: Web3WalletService
  ) {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  public async getMainnetTokenBalance() {
    const currentWalletAddress = await this.provider.getSigner().getAddress();

    const mindsToken = new ethers.Contract(
      this.tokenAddressMainnet,
      this.web3Wallet.config.token.abi,
      this.provider.getSigner()
    );

    return mindsToken.balanceOf(currentWalletAddress);
  }

  public async approve(amount: number): Promise<void> {
    const amountWei = this.web3Wallet.toWei(amount);

    const mindsToken = new ethers.Contract(
      this.tokenAddressMainnet,
      this.web3Wallet.config.token.abi,
      this.provider.getSigner()
    );

    const approvalTx = await mindsToken.approve(
      this.depositBoxAddress,
      amountWei
    );
    const receipt = await approvalTx.wait();
    return receipt;
  }

  public async deposit(amount: number): Promise<void> {
    const { chainId } = await this.provider.getNetwork();

    if (chainId !== parseInt(this.chainIds.rinkeby, 16)) {
      this.toast.warn('Unavailable on this network - please switch');
      return;
    }

    if (!amount) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const currentWalletAddress = await this.provider.getSigner().getAddress();

    const amountWei = this.web3Wallet.toWei(amount);

    const depositBox = new ethers.Contract(
      this.depositBoxAddress,
      this.depositBoxAbi,
      this.provider.getSigner()
    );

    // const depositSigner = DepositBox.connect(this.provider.getSigner());
    const depositTx = await depositBox.depositERC20(
      this.skaleChainName,
      this.tokenAddressMainnet,
      currentWalletAddress,
      amountWei,
      {
        type: 2,
        gasLimit: 6500000,
      }
    );

    const depositReceipt = await depositTx;
    return depositReceipt;
  }

  // TODO: Withdraw
  withdraw = () => void 0;

  /**
   * SKALE: 0x466ec1d61bcef
   * Rinekby: 0x4
   */
  private async switchNetwork(chainId: string = '0x4') {
    const currentChainId = (await this.provider.getNetwork())?.chainId;

    if (parseInt(chainId, 16) === currentChainId) {
      this.toast.warn('Already on this network');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
      // TODO: ON SUCCESS THIS HAS TO RELOAD THE BROWSER WINDOW OR FACE MAJOR ISSUES
      window.location.reload();
    } catch (switchError) {
      console.log('error thrown - network does not already exist');
      console.error(switchError);
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: chainId, rpcUrl: this.rpcUrl }],
          });
          // TODO: ON SUCCESS THIS HAS TO RELOAD THE BROWSER WINDOW OR FACE MAJOR ISSUES
          window.location.reload();
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  }

  public switchNetworkRinkeby(): Promise<void> {
    return this.switchNetwork(this.chainIds.rinkeby);
  }

  public switchNetworkSkale(): Promise<void> {
    return this.switchNetwork(this.chainIds.skale);
  }
}

export const RINKEBY_ABIS = {
  message_proxy_mainnet_address: '0x90d12C0F88f5f3776e5aEB68F11F573B96EFc351',
  message_proxy_mainnet_abi: [
    {
      type: 'event',
      anonymous: false,
      name: 'GasCostMessageHeaderWasChanged',
      inputs: [
        {
          type: 'uint256',
          name: 'oldValue',
          indexed: false,
        },
        {
          type: 'uint256',
          name: 'newValue',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'GasCostMessageWasChanged',
      inputs: [
        {
          type: 'uint256',
          name: 'oldValue',
          indexed: false,
        },
        {
          type: 'uint256',
          name: 'newValue',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'GasLimitWasChanged',
      inputs: [
        {
          type: 'uint256',
          name: 'oldValue',
          indexed: false,
        },
        {
          type: 'uint256',
          name: 'newValue',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'OutgoingMessage',
      inputs: [
        {
          type: 'bytes32',
          name: 'dstChainHash',
          indexed: true,
        },
        {
          type: 'uint256',
          name: 'msgCounter',
          indexed: true,
        },
        {
          type: 'address',
          name: 'srcContract',
          indexed: true,
        },
        {
          type: 'address',
          name: 'dstContract',
          indexed: false,
        },
        {
          type: 'bytes',
          name: 'data',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'PostMessageError',
      inputs: [
        {
          type: 'uint256',
          name: 'msgCounter',
          indexed: true,
        },
        {
          type: 'bytes',
          name: 'message',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleAdminChanged',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'previousAdminRole',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'newAdminRole',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleGranted',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleRevoked',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'function',
      name: 'CHAIN_CONNECTOR_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'CONSTANT_SETTER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'DEFAULT_ADMIN_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'EXTRA_CONTRACT_REGISTRAR_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'MAINNET_HASH',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'MESSAGES_LENGTH',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'addConnectedChain',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'communityPool',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'connectedChains',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: 'incomingMessageCounter',
        },
        {
          type: 'uint256',
          name: 'outgoingMessageCounter',
        },
        {
          type: 'bool',
          name: 'inited',
        },
      ],
    },
    {
      type: 'function',
      name: 'contractManagerOfSkaleManager',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'gasLimit',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getIncomingMessagesCounter',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'fromSchainName',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getOutgoingMessagesCounter',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'targetSchainName',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleAdmin',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMember',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'uint256',
          name: 'index',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMemberCount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'grantRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'hasRole',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'headerMessageGasCost',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initializeMessageProxy',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'uint256',
          name: 'newGasLimit',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'isConnectedChain',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isContractRegistered',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'contractAddress',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isSchainOwner',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'messageGasCost',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'postIncomingMessages',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'fromSchainName',
        },
        {
          type: 'uint256',
          name: 'startingCounter',
        },
        {
          type: 'tuple[]',
          name: 'messages',
          components: [
            {
              type: 'address',
              name: 'sender',
            },
            {
              type: 'address',
              name: 'destinationContract',
            },
            {
              type: 'bytes',
              name: 'data',
            },
          ],
        },
        {
          type: 'tuple',
          name: 'sign',
          components: [
            {
              type: 'uint256[2]',
              name: 'blsSignature',
            },
            {
              type: 'uint256',
              name: 'hashA',
            },
            {
              type: 'uint256',
              name: 'hashB',
            },
            {
              type: 'uint256',
              name: 'counter',
            },
          ],
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'postOutgoingMessage',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'targetChainHash',
        },
        {
          type: 'address',
          name: 'targetContract',
        },
        {
          type: 'bytes',
          name: 'data',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'registerExtraContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'extraContract',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'registerExtraContractForAll',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'extraContract',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'registryContracts',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
        {
          type: 'address',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'removeConnectedChain',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'removeExtraContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'extraContract',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'removeExtraContractForAll',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'extraContract',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'renounceRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'revokeRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'setCommunityPool',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newCommunityPoolAddress',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'setNewGasLimit',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'uint256',
          name: 'newGasLimit',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'setNewHeaderMessageGasCost',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'uint256',
          name: 'newHeaderMessageGasCost',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'setNewMessageGasCost',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'uint256',
          name: 'newMessageGasCost',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'supportsInterface',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes4',
          name: 'interfaceId',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
  ],
  linker_address: '0x3bF2C2109C9f1DF1622D04D275D261De456d45c1',
  linker_abi: [
    {
      type: 'event',
      anonymous: false,
      name: 'RoleAdminChanged',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'previousAdminRole',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'newAdminRole',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleGranted',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleRevoked',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'function',
      name: 'DEFAULT_ADMIN_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'LINKER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'addSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'contractReceiver',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'allowInterchainConnections',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'connectSchain',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address[]',
          name: 'schainContracts',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'contractManagerOfSkaleManager',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'disconnectSchain',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getRoleAdmin',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMember',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'uint256',
          name: 'index',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMemberCount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'grantRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'hasMainnetContract',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'mainnetContract',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasRole',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasSchain',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: 'connected',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasSchainContract',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'messageProxyValue',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newContractManagerOfSkaleManager',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'interchainConnections',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isNotKilled',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isSchainOwner',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'kill',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'messageProxy',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'registerMainnetContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newMainnetContract',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'removeMainnetContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'mainnetContract',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'removeSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'renounceRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'revokeRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'schainLinks',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'statuses',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'uint8',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'supportsInterface',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes4',
          name: 'interfaceId',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
  ],
  community_pool_address: '0xDD67f7bF39bCbcBC0146141Ab7722765911c8E90',
  community_pool_abi: [
    {
      type: 'event',
      anonymous: false,
      name: 'MinTransactionGasWasChanged',
      inputs: [
        {
          type: 'uint256',
          name: 'oldValue',
          indexed: false,
        },
        {
          type: 'uint256',
          name: 'newValue',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleAdminChanged',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'previousAdminRole',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'newAdminRole',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleGranted',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleRevoked',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'function',
      name: 'CONSTANT_SETTER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'DEFAULT_ADMIN_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'LINKER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'activeUsers',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: '',
        },
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'addSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'contractReceiver',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'contractManagerOfSkaleManager',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getBalance',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleAdmin',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMember',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'uint256',
          name: 'index',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMemberCount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'grantRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'hasRole',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasSchainContract',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'newMessageProxy',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'linker',
        },
        {
          type: 'address',
          name: 'messageProxyValue',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newContractManagerOfSkaleManager',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'isSchainOwner',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'messageProxy',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'minTransactionGas',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'rechargeUserWallet',
      constant: false,
      stateMutability: 'payable',
      payable: true,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'refundGasByUser',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'schainHash',
        },
        {
          type: 'address',
          name: 'node',
        },
        {
          type: 'address',
          name: 'user',
        },
        {
          type: 'uint256',
          name: 'gas',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'removeSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'renounceRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'revokeRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'schainLinks',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'setMinTransactionGas',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'uint256',
          name: 'newMinTransactionGas',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'supportsInterface',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes4',
          name: 'interfaceId',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'withdrawFunds',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'uint256',
          name: 'amount',
        },
      ],
      outputs: [],
    },
  ],
  deposit_box_eth_address: '0x08473e763d6e6e2Fc634d718D5A043649F38bfAf',
  deposit_box_eth_abi: [
    {
      type: 'event',
      anonymous: false,
      name: 'RoleAdminChanged',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'previousAdminRole',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'newAdminRole',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleGranted',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleRevoked',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'function',
      name: 'DEFAULT_ADMIN_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'DEPOSIT_BOX_MANAGER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'LINKER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'addSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'contractReceiver',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'approveTransfers',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'contractManagerOfSkaleManager',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'deposit',
      constant: false,
      stateMutability: 'payable',
      payable: true,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'to',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'disableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'enableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getFunds',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'receiver',
        },
        {
          type: 'uint256',
          name: 'amount',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getMyEth',
      constant: false,
      payable: false,
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getRoleAdmin',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMember',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'uint256',
          name: 'index',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMemberCount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'grantRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'hasRole',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasSchainContract',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'newMessageProxy',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'linkerValue',
        },
        {
          type: 'address',
          name: 'messageProxyValue',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newContractManagerOfSkaleManager',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'isSchainOwner',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isWhitelisted',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'linker',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'messageProxy',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'postMessage',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'schainHash',
        },
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes',
          name: 'data',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'removeSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'renounceRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'revokeRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'schainLinks',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'supportsInterface',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes4',
          name: 'interfaceId',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'transferredAmount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
  ],
  deposit_box_erc20_address: '0x706190B6DfAa002abe1f334f82cc0de81626f343',
  deposit_box_erc20_abi: [
    {
      type: 'event',
      anonymous: false,
      name: 'ERC20TokenAdded',
      inputs: [
        {
          type: 'string',
          name: 'schainName',
          indexed: false,
        },
        {
          type: 'address',
          name: 'contractOnMainnet',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'ERC20TokenReady',
      inputs: [
        {
          type: 'address',
          name: 'contractOnMainnet',
          indexed: true,
        },
        {
          type: 'uint256',
          name: 'amount',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleAdminChanged',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'previousAdminRole',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'newAdminRole',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleGranted',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleRevoked',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'function',
      name: 'DEFAULT_ADMIN_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'DEPOSIT_BOX_MANAGER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'LINKER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'addERC20TokenByOwner',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc20OnMainnet',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'addSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'contractReceiver',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'contractManagerOfSkaleManager',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'depositERC20',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc20OnMainnet',
        },
        {
          type: 'address',
          name: 'to',
        },
        {
          type: 'uint256',
          name: 'amount',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'disableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'enableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getFunds',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc20OnMainnet',
        },
        {
          type: 'address',
          name: 'receiver',
        },
        {
          type: 'uint256',
          name: 'amount',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getRoleAdmin',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMember',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'uint256',
          name: 'index',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMemberCount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getSchainToERC20',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc20OnMainnet',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'grantRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'hasRole',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasSchainContract',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'newMessageProxy',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'linkerValue',
        },
        {
          type: 'address',
          name: 'messageProxyValue',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newContractManagerOfSkaleManager',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'isSchainOwner',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isWhitelisted',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'linker',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'messageProxy',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'postMessage',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'schainHash',
        },
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes',
          name: 'data',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'removeSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'renounceRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'revokeRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'schainLinks',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'schainToERC20',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
        {
          type: 'address',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'supportsInterface',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes4',
          name: 'interfaceId',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'transferredAmount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
        {
          type: 'address',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
  ],
  deposit_box_erc721_address: '0x38f65677A112E67C816d5dA001BEEc977D85343E',
  deposit_box_erc721_abi: [
    {
      type: 'event',
      anonymous: false,
      name: 'ERC721TokenAdded',
      inputs: [
        {
          type: 'string',
          name: 'schainName',
          indexed: false,
        },
        {
          type: 'address',
          name: 'contractOnMainnet',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'ERC721TokenReady',
      inputs: [
        {
          type: 'address',
          name: 'contractOnMainnet',
          indexed: true,
        },
        {
          type: 'uint256',
          name: 'tokenId',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleAdminChanged',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'previousAdminRole',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'newAdminRole',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleGranted',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleRevoked',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'function',
      name: 'DEFAULT_ADMIN_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'DEPOSIT_BOX_MANAGER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'LINKER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'addERC721TokenByOwner',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc721OnMainnet',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'addSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'contractReceiver',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'contractManagerOfSkaleManager',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'depositERC721',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc721OnMainnet',
        },
        {
          type: 'address',
          name: 'to',
        },
        {
          type: 'uint256',
          name: 'tokenId',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'disableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'enableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getFunds',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc721OnMainnet',
        },
        {
          type: 'address',
          name: 'receiver',
        },
        {
          type: 'uint256',
          name: 'tokenId',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getRoleAdmin',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMember',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'uint256',
          name: 'index',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMemberCount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getSchainToERC721',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc721OnMainnet',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'grantRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'hasRole',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasSchainContract',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'newMessageProxy',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'linkerValue',
        },
        {
          type: 'address',
          name: 'messageProxyValue',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newContractManagerOfSkaleManager',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'isSchainOwner',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isWhitelisted',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'linker',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'messageProxy',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'postMessage',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'schainHash',
        },
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes',
          name: 'data',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'removeSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'renounceRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'revokeRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'schainLinks',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'schainToERC721',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
        {
          type: 'address',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'supportsInterface',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes4',
          name: 'interfaceId',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'transferredAmount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: '',
        },
        {
          type: 'uint256',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
  ],
  deposit_box_erc1155_address: '0x22F4Ad8F8574293975193A507d9E6C8578f487BD',
  deposit_box_erc1155_abi: [
    {
      type: 'event',
      anonymous: false,
      name: 'ERC1155TokenAdded',
      inputs: [
        {
          type: 'string',
          name: 'schainName',
          indexed: false,
        },
        {
          type: 'address',
          name: 'contractOnMainnet',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'ERC1155TokenReady',
      inputs: [
        {
          type: 'address',
          name: 'contractOnMainnet',
          indexed: true,
        },
        {
          type: 'uint256[]',
          name: 'ids',
          indexed: false,
        },
        {
          type: 'uint256[]',
          name: 'amounts',
          indexed: false,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleAdminChanged',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'previousAdminRole',
          indexed: true,
        },
        {
          type: 'bytes32',
          name: 'newAdminRole',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleGranted',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'event',
      anonymous: false,
      name: 'RoleRevoked',
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
          indexed: true,
        },
        {
          type: 'address',
          name: 'account',
          indexed: true,
        },
        {
          type: 'address',
          name: 'sender',
          indexed: true,
        },
      ],
    },
    {
      type: 'function',
      name: 'DEFAULT_ADMIN_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'DEPOSIT_BOX_MANAGER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'LINKER_ROLE',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'addERC1155TokenByOwner',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc1155OnMainnet',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'addSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'contractReceiver',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'contractManagerOfSkaleManager',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'depositERC1155',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc1155OnMainnet',
        },
        {
          type: 'address',
          name: 'to',
        },
        {
          type: 'uint256',
          name: 'id',
        },
        {
          type: 'uint256',
          name: 'amount',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'depositERC1155Batch',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc1155OnMainnet',
        },
        {
          type: 'address',
          name: 'to',
        },
        {
          type: 'uint256[]',
          name: 'ids',
        },
        {
          type: 'uint256[]',
          name: 'amounts',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'disableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'enableWhitelist',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getFunds',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc1155OnMainnet',
        },
        {
          type: 'address',
          name: 'receiver',
        },
        {
          type: 'uint256[]',
          name: 'ids',
        },
        {
          type: 'uint256[]',
          name: 'amounts',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'getRoleAdmin',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMember',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'uint256',
          name: 'index',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getRoleMemberCount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'getSchainToERC1155',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
        {
          type: 'address',
          name: 'erc1155OnMainnet',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'grantRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'hasRole',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'hasSchainContract',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'newMessageProxy',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'contractManagerOfSkaleManagerValue',
        },
        {
          type: 'address',
          name: 'linkerValue',
        },
        {
          type: 'address',
          name: 'messageProxyValue',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'initialize',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'newContractManagerOfSkaleManager',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'isSchainOwner',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes32',
          name: 'schainHash',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'isWhitelisted',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'linker',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'messageProxy',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'onERC1155BatchReceived',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'operator',
        },
        {
          type: 'address',
          name: '',
        },
        {
          type: 'uint256[]',
          name: '',
        },
        {
          type: 'uint256[]',
          name: '',
        },
        {
          type: 'bytes',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bytes4',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'onERC1155Received',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'address',
          name: 'operator',
        },
        {
          type: 'address',
          name: '',
        },
        {
          type: 'uint256',
          name: '',
        },
        {
          type: 'uint256',
          name: '',
        },
        {
          type: 'bytes',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bytes4',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'postMessage',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'schainHash',
        },
        {
          type: 'address',
          name: 'sender',
        },
        {
          type: 'bytes',
          name: 'data',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: 'receiver',
        },
      ],
    },
    {
      type: 'function',
      name: 'removeSchainContract',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'string',
          name: 'schainName',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'renounceRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'revokeRole',
      constant: false,
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: 'role',
        },
        {
          type: 'address',
          name: 'account',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'schainLinks',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'address',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'schainToERC1155',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
        {
          type: 'address',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'supportsInterface',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes4',
          name: 'interfaceId',
        },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        },
      ],
    },
    {
      type: 'function',
      name: 'transferredAmount',
      constant: true,
      stateMutability: 'view',
      payable: false,
      inputs: [
        {
          type: 'bytes32',
          name: '',
        },
        {
          type: 'address',
          name: '',
        },
        {
          type: 'uint256',
          name: '',
        },
      ],
      outputs: [
        {
          type: 'uint256',
          name: '',
        },
      ],
    },
  ],
};

export const SKALE_ABIS = {
  proxy_admin_address: '0xd2aAa00000000000000000000000000000000000',
  proxy_admin_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'contract TransparentUpgradeableProxy',
          name: 'proxy',
          type: 'address',
        },
        { internalType: 'address', name: 'newAdmin', type: 'address' },
      ],
      name: 'changeProxyAdmin',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract TransparentUpgradeableProxy',
          name: 'proxy',
          type: 'address',
        },
      ],
      name: 'getProxyAdmin',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract TransparentUpgradeableProxy',
          name: 'proxy',
          type: 'address',
        },
      ],
      name: 'getProxyImplementation',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract TransparentUpgradeableProxy',
          name: 'proxy',
          type: 'address',
        },
        { internalType: 'address', name: 'implementation', type: 'address' },
      ],
      name: 'upgrade',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract TransparentUpgradeableProxy',
          name: 'proxy',
          type: 'address',
        },
        { internalType: 'address', name: 'implementation', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'upgradeAndCall',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ],
  message_proxy_chain_address: '0xd2AAa00100000000000000000000000000000000',
  message_proxy_chain_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'oldValue',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'newValue',
          type: 'uint256',
        },
      ],
      name: 'GasLimitWasChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'dstChainHash',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'msgCounter',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'srcContract',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'dstContract',
          type: 'address',
        },
        { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'OutgoingMessage',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'uint256',
          name: 'msgCounter',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'message',
          type: 'bytes',
        },
      ],
      name: 'PostMessageError',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'CHAIN_CONNECTOR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'CONSTANT_SETTER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'EXTRA_CONTRACT_REGISTRAR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_HASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MESSAGES_LENGTH',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'chainName', type: 'string' }],
      name: 'addConnectedChain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'connectedChains',
      outputs: [
        {
          internalType: 'uint256',
          name: 'incomingMessageCounter',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'outgoingMessageCounter',
          type: 'uint256',
        },
        { internalType: 'bool', name: 'inited', type: 'bool' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'gasLimit',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'fromSchainName', type: 'string' },
      ],
      name: 'getIncomingMessagesCounter',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'targetSchainName', type: 'string' },
      ],
      name: 'getOutgoingMessagesCounter',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract KeyStorage',
          name: 'blsKeyStorage',
          type: 'address',
        },
        { internalType: 'string', name: 'schainName', type: 'string' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'newGasLimit', type: 'uint256' },
      ],
      name: 'initializeMessageProxy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'isConnectedChain',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'schainName', type: 'string' },
        { internalType: 'address', name: 'contractAddress', type: 'address' },
      ],
      name: 'isContractRegistered',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'keyStorage',
      outputs: [
        { internalType: 'contract KeyStorage', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'fromChainName', type: 'string' },
        { internalType: 'uint256', name: 'startingCounter', type: 'uint256' },
        {
          components: [
            { internalType: 'address', name: 'sender', type: 'address' },
            {
              internalType: 'address',
              name: 'destinationContract',
              type: 'address',
            },
            { internalType: 'bytes', name: 'data', type: 'bytes' },
          ],
          internalType: 'struct MessageProxy.Message[]',
          name: 'messages',
          type: 'tuple[]',
        },
        {
          components: [
            {
              internalType: 'uint256[2]',
              name: 'blsSignature',
              type: 'uint256[2]',
            },
            { internalType: 'uint256', name: 'hashA', type: 'uint256' },
            { internalType: 'uint256', name: 'hashB', type: 'uint256' },
            { internalType: 'uint256', name: 'counter', type: 'uint256' },
          ],
          internalType: 'struct MessageProxy.Signature',
          name: 'signature',
          type: 'tuple',
        },
      ],
      name: 'postIncomingMessages',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'targetChainHash', type: 'bytes32' },
        { internalType: 'address', name: 'targetContract', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'postOutgoingMessage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'chainName', type: 'string' },
        { internalType: 'address', name: 'extraContract', type: 'address' },
      ],
      name: 'registerExtraContract',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'extraContract', type: 'address' },
      ],
      name: 'registerExtraContractForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: '', type: 'bytes32' },
        { internalType: 'address', name: '', type: 'address' },
      ],
      name: 'registryContracts',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'chainName', type: 'string' }],
      name: 'removeConnectedChain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'chainName', type: 'string' },
        { internalType: 'address', name: 'extraContract', type: 'address' },
      ],
      name: 'removeExtraContract',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'extraContract', type: 'address' },
      ],
      name: 'removeExtraContractForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'schainHash',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'newGasLimit', type: 'uint256' },
      ],
      name: 'setNewGasLimit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'bytes32', name: 'dstChain', type: 'bytes32' },
            { internalType: 'uint256', name: 'msgCounter', type: 'uint256' },
            { internalType: 'address', name: 'srcContract', type: 'address' },
            { internalType: 'address', name: 'dstContract', type: 'address' },
            { internalType: 'bytes', name: 'data', type: 'bytes' },
          ],
          internalType: 'struct MessageProxyForSchain.OutgoingMessageData',
          name: 'message',
          type: 'tuple',
        },
      ],
      name: 'verifyOutgoingMessageData',
      outputs: [{ internalType: 'bool', name: 'isValidMessage', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  key_storage_address: '0xd2aaa00200000000000000000000000000000000',
  key_storage_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'FN_NUM_GET_CONFIG_VARIABLE_UINT256',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'FREE_MEM_PTR',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getBlsCommonPublicKey',
      outputs: [
        {
          components: [
            {
              components: [
                { internalType: 'uint256', name: 'a', type: 'uint256' },
                { internalType: 'uint256', name: 'b', type: 'uint256' },
              ],
              internalType: 'struct Fp2Operations.Fp2Point',
              name: 'x',
              type: 'tuple',
            },
            {
              components: [
                { internalType: 'uint256', name: 'a', type: 'uint256' },
                { internalType: 'uint256', name: 'b', type: 'uint256' },
              ],
              internalType: 'struct Fp2Operations.Fp2Point',
              name: 'y',
              type: 'tuple',
            },
          ],
          internalType: 'struct G2Operations.G2Point',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  community_locker_address: '0xD2aaa00300000000000000000000000000000000',
  community_locker_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'schainHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'user',
          type: 'address',
        },
      ],
      name: 'ActivateUser',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'schainHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'user',
          type: 'address',
        },
      ],
      name: 'LockUser',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'oldValue',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'newValue',
          type: 'uint256',
        },
      ],
      name: 'TimeLimitPerMessageWasChanged',
      type: 'event',
    },
    {
      inputs: [],
      name: 'CONSTANT_SETTER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_HASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_NAME',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'activeUsers',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
      name: 'checkAllowedToSendMessage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'communityPool',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newSchainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newTokenManagerLinker',
          type: 'address',
        },
        { internalType: 'address', name: 'newCommunityPool', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'messageProxy',
      outputs: [
        {
          internalType: 'contract MessageProxyForSchain',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'fromChainHash', type: 'bytes32' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'postMessage',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'schainHash',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'newTimeLimitPerMessage',
          type: 'uint256',
        },
      ],
      name: 'setTimeLimitPerMessage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'timeLimitPerMessage',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'tokenManagerLinker',
      outputs: [
        {
          internalType: 'contract TokenManagerLinker',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  token_manager_linker_address: '0xD2aAA00800000000000000000000000000000000',
  token_manager_linker_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'bool',
          name: 'isAllowed',
          type: 'bool',
        },
      ],
      name: 'InterchainConnectionAllowed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_HASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_NAME',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'REGISTRAR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'schainName', type: 'string' },
        {
          internalType: 'address[]',
          name: 'tokenManagerAddresses',
          type: 'address[]',
        },
      ],
      name: 'connectSchain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'disconnectSchain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'hasSchain',
      outputs: [{ internalType: 'bool', name: 'connected', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract TokenManager',
          name: 'tokenManager',
          type: 'address',
        },
      ],
      name: 'hasTokenManager',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract MessageProxy',
          name: 'newMessageProxyAddress',
          type: 'address',
        },
        { internalType: 'address', name: 'linker', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'interchainConnections',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'linkerAddress',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'messageProxy',
      outputs: [
        { internalType: 'contract MessageProxy', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'fromChainHash', type: 'bytes32' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'postMessage',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract TokenManager',
          name: 'newTokenManager',
          type: 'address',
        },
      ],
      name: 'registerTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract TokenManager',
          name: 'tokenManagerAddress',
          type: 'address',
        },
      ],
      name: 'removeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'tokenManagers',
      outputs: [
        { internalType: 'contract TokenManager', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  token_manager_eth_address: '0xd2AaA00400000000000000000000000000000000',
  token_manager_eth_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'oldValue',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'newValue',
          type: 'address',
        },
      ],
      name: 'DepositBoxWasChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'AUTOMATIC_DEPLOY_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_HASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_NAME',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'TOKEN_REGISTRAR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'schainName', type: 'string' },
        { internalType: 'address', name: 'newTokenManager', type: 'address' },
      ],
      name: 'addTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'automaticDeploy',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'changeDepositBoxAddress',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'communityLocker',
      outputs: [
        { internalType: 'contract CommunityLocker', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'depositBox',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'disableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'enableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'ethErc20',
      outputs: [
        { internalType: 'contract EthErc20', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'exitToMain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'hasTokenManager',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newChainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
        {
          internalType: 'contract EthErc20',
          name: 'ethErc20Address',
          type: 'address',
        },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newSchainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'initializeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'messageProxy',
      outputs: [
        {
          internalType: 'contract MessageProxyForSchain',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'fromChainHash', type: 'bytes32' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'postMessage',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'removeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'schainHash',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract EthErc20',
          name: 'newEthErc20Address',
          type: 'address',
        },
      ],
      name: 'setEthErc20Address',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'tokenManagerLinker',
      outputs: [
        {
          internalType: 'contract TokenManagerLinker',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'tokenManagers',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'targetSchainName', type: 'string' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferToSchain',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  token_manager_erc20_address: '0xD2aAA00500000000000000000000000000000000',
  token_manager_erc20_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'oldValue',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'newValue',
          type: 'address',
        },
      ],
      name: 'DepositBoxWasChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc20OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc20OnSchain',
          type: 'address',
        },
      ],
      name: 'ERC20TokenAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc20OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc20OnSchain',
          type: 'address',
        },
      ],
      name: 'ERC20TokenCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc20OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc20OnSchain',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'ERC20TokenReceived',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'AUTOMATIC_DEPLOY_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_HASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_NAME',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'TOKEN_REGISTRAR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'erc20OnMainnet', type: 'address' },
        {
          internalType: 'contract ERC20OnChain',
          name: 'erc20OnSchain',
          type: 'address',
        },
      ],
      name: 'addERC20TokenByOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'schainName', type: 'string' },
        { internalType: 'address', name: 'newTokenManager', type: 'address' },
      ],
      name: 'addTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'automaticDeploy',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'changeDepositBoxAddress',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'clonesErc20',
      outputs: [
        { internalType: 'contract ERC20OnChain', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'communityLocker',
      outputs: [
        { internalType: 'contract CommunityLocker', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'depositBox',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'disableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'enableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'exitToMainERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'hasTokenManager',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newChainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newSchainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'initializeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'messageProxy',
      outputs: [
        {
          internalType: 'contract MessageProxyForSchain',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'fromChainHash', type: 'bytes32' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'postMessage',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'removeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'schainHash',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'tokenManagerLinker',
      outputs: [
        {
          internalType: 'contract TokenManagerLinker',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'tokenManagers',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract IERC20Upgradeable',
          name: '',
          type: 'address',
        },
      ],
      name: 'totalSupplyOnMainnet',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'targetSchainName', type: 'string' },
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferToSchainERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  token_manager_erc721_address: '0xD2aaa00600000000000000000000000000000000',
  token_manager_erc721_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'oldValue',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'newValue',
          type: 'address',
        },
      ],
      name: 'DepositBoxWasChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc721OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc721OnSchain',
          type: 'address',
        },
      ],
      name: 'ERC721TokenAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc721OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc721OnSchain',
          type: 'address',
        },
      ],
      name: 'ERC721TokenCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc721OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc721OnSchain',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ERC721TokenReceived',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'AUTOMATIC_DEPLOY_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_HASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_NAME',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'TOKEN_REGISTRAR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'erc721OnMainnet', type: 'address' },
        {
          internalType: 'contract ERC721OnChain',
          name: 'erc721OnSchain',
          type: 'address',
        },
      ],
      name: 'addERC721TokenByOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'schainName', type: 'string' },
        { internalType: 'address', name: 'newTokenManager', type: 'address' },
      ],
      name: 'addTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'automaticDeploy',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'changeDepositBoxAddress',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'clonesErc721',
      outputs: [
        { internalType: 'contract ERC721OnChain', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'communityLocker',
      outputs: [
        { internalType: 'contract CommunityLocker', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'depositBox',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'disableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'enableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'exitToMainERC721',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'hasTokenManager',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newChainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newSchainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'initializeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'messageProxy',
      outputs: [
        {
          internalType: 'contract MessageProxyForSchain',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'fromChainHash', type: 'bytes32' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'postMessage',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'removeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'schainHash',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'tokenManagerLinker',
      outputs: [
        {
          internalType: 'contract TokenManagerLinker',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'tokenManagers',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'targetSchainName', type: 'string' },
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'transferToSchainERC721',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  token_manager_erc1155_address: '0xD2aaA00900000000000000000000000000000000',
  token_manager_erc1155_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'oldValue',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'newValue',
          type: 'address',
        },
      ],
      name: 'DepositBoxWasChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc1155OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc1155OnSchain',
          type: 'address',
        },
      ],
      name: 'ERC1155TokenAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc1155OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc1155OnSchain',
          type: 'address',
        },
      ],
      name: 'ERC1155TokenCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'erc1155OnMainnet',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'erc1155OnSchain',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256[]',
          name: 'ids',
          type: 'uint256[]',
        },
        {
          indexed: false,
          internalType: 'uint256[]',
          name: 'amounts',
          type: 'uint256[]',
        },
      ],
      name: 'ERC1155TokenReceived',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      inputs: [],
      name: 'AUTOMATIC_DEPLOY_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_HASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MAINNET_NAME',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'TOKEN_REGISTRAR_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'erc1155OnMainnet', type: 'address' },
        {
          internalType: 'contract ERC1155OnChain',
          name: 'erc1155OnSchain',
          type: 'address',
        },
      ],
      name: 'addERC1155TokenByOwner',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'schainName', type: 'string' },
        { internalType: 'address', name: 'newTokenManager', type: 'address' },
      ],
      name: 'addTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'automaticDeploy',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'changeDepositBoxAddress',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'clonesErc1155',
      outputs: [
        { internalType: 'contract ERC1155OnChain', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'communityLocker',
      outputs: [
        { internalType: 'contract CommunityLocker', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'depositBox',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'disableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'enableAutomaticDeploy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'id', type: 'uint256' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'exitToMainERC1155',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
        { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      ],
      name: 'exitToMainERC1155Batch',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'hasTokenManager',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newChainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'newSchainName', type: 'string' },
        {
          internalType: 'contract MessageProxyForSchain',
          name: 'newMessageProxy',
          type: 'address',
        },
        {
          internalType: 'contract TokenManagerLinker',
          name: 'newIMALinker',
          type: 'address',
        },
        {
          internalType: 'contract CommunityLocker',
          name: 'newCommunityLocker',
          type: 'address',
        },
        { internalType: 'address', name: 'newDepositBox', type: 'address' },
      ],
      name: 'initializeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'messageProxy',
      outputs: [
        {
          internalType: 'contract MessageProxyForSchain',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'fromChainHash', type: 'bytes32' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'postMessage',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'schainName', type: 'string' }],
      name: 'removeTokenManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'schainHash',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'tokenManagerLinker',
      outputs: [
        {
          internalType: 'contract TokenManagerLinker',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'tokenManagers',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'targetSchainName', type: 'string' },
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'id', type: 'uint256' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferToSchainERC1155',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'targetSchainName', type: 'string' },
        { internalType: 'address', name: 'contractOnMainnet', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
        { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      ],
      name: 'transferToSchainERC1155Batch',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  eth_erc20_address: '0xD2Aaa00700000000000000000000000000000000',
  eth_erc20_abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'BURNER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MINTER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'burnFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'forceBurn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenManagerEthAddress',
          type: 'address',
        },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  ERC20OnChain_abi: [
    {
      inputs: [
        { internalType: 'string', name: 'contractName', type: 'string' },
        { internalType: 'string', name: 'contractSymbol', type: 'string' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MINTER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'burnFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  ERC721OnChain_abi: [
    {
      inputs: [
        { internalType: 'string', name: 'contractName', type: 'string' },
        { internalType: 'string', name: 'contractSymbol', type: 'string' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'approved',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MINTER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'getApproved',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'operator', type: 'address' },
      ],
      name: 'isApprovedForAll',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'ownerOf',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        { internalType: 'bytes', name: '_data', type: 'bytes' },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'operator', type: 'address' },
        { internalType: 'bool', name: 'approved', type: 'bool' },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        { internalType: 'string', name: 'tokenUri', type: 'string' },
      ],
      name: 'setTokenURI',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  ERC1155OnChain_abi: [
    {
      inputs: [{ internalType: 'string', name: 'uri', type: 'string' }],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'previousAdminRole',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'newAdminRole',
          type: 'bytes32',
        },
      ],
      name: 'RoleAdminChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleGranted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'role',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'RoleRevoked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256[]',
          name: 'ids',
          type: 'uint256[]',
        },
        {
          indexed: false,
          internalType: 'uint256[]',
          name: 'values',
          type: 'uint256[]',
        },
      ],
      name: 'TransferBatch',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'id',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'TransferSingle',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: 'value',
          type: 'string',
        },
        { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      ],
      name: 'URI',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DEFAULT_ADMIN_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MINTER_ROLE',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'id', type: 'uint256' },
      ],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address[]', name: 'accounts', type: 'address[]' },
        { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
      ],
      name: 'balanceOfBatch',
      outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'id', type: 'uint256' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
        { internalType: 'uint256[]', name: 'values', type: 'uint256[]' },
      ],
      name: 'burnBatch',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleAdmin',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'getRoleMember',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
      name: 'getRoleMemberCount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'grantRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'hasRole',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'address', name: 'operator', type: 'address' },
      ],
      name: 'isApprovedForAll',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256', name: 'id', type: 'uint256' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
        { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'mintBatch',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'renounceRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'role', type: 'bytes32' },
        { internalType: 'address', name: 'account', type: 'address' },
      ],
      name: 'revokeRole',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
        { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'safeBatchTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'id', type: 'uint256' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'operator', type: 'address' },
        { internalType: 'bool', name: 'approved', type: 'bool' },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'uri',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
};
