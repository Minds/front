import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { InviteModal } from '../../../modals/invite/invite';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--transactions',
  templateUrl: 'transactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WalletTokenTransactionsComponent {

  startDate: string;
  endDate: string;
  addresses: Array<{label: string, address?: string, selected: boolean}> = [];
  inProgress: boolean = false;
  transactions: any[] = [];
  offset: string;
  moreData: boolean = true;
  selectedAddress: string | null = null;
  selectedContract: string | null = null;
  contracts: string[] = [
    'withdraw',
    'wire',
    'offchain:wire',
    'plus',
    'token',
    'offchain:reward',
  ];

  contractsToggle: boolean = false;
  addressesToggle: boolean = false;

  @Input() preview: boolean = false; // Preview mode

  paramsSubscription;

  remote: boolean = false;
  remoteUser: string = '';

  constructor(
    protected client: Client,
    protected web3Wallet: Web3WalletService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
  ) {

  }

  async ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(async params => {
      if (params['contract']) {
        const contract = params['contract'];

        if (contract !== 'all' && this.contracts.indexOf(contract) !== -1) {
          this.selectedContract = contract;
        } else if (contract !== 'all') {
          this.router.navigate(['/wallet/token/transactions', 'all']);
        }
      }

      this.remote = !!params['remote'];
      this.remoteUser = params['remote'] || '';

      const d = new Date();

      d.setHours(23, 59, 59);
      this.endDate = d.toISOString();

      d.setMonth(d.getMonth() - 1);
      d.setHours(0, 0, 0);
      this.startDate = d.toISOString();

      await this.getAddresses();
      this.load(true);
    });
  }

  async getAddresses() {
    this.inProgress = true;

    if (!this.remote) {
      let receiverAddress: string = this.session.getLoggedInUser().eth_wallet;

      this.addresses = [
        {
          address: receiverAddress,
          label: 'Receiver',
          selected: false
        },
        {
          label: 'OffChain',
          address: 'offchain',
          selected: false
        }
      ];

      try {
        const onchainAddress = await this.web3Wallet.getCurrentWallet();
        if (!onchainAddress) {
          this.inProgress = false;
          this.detectChanges();
          return;
        }

        if (this.addresses[0].address.toLowerCase() == onchainAddress.toLowerCase()) {
          this.addresses[0].label = 'OnChain & Receiver';
          this.inProgress = false;
          this.detectChanges();
          return; //no need to count twice
        }

        this.addresses.unshift({
          'label': "OnChain",
          'address': onchainAddress,
          'selected': false
        });
        this.inProgress = false;
        this.detectChanges();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.selectedAddress = null;
      this.addresses = [];
      this.inProgress = false;
    }
  }

  async load(refresh: boolean) {
    if (this.inProgress && !refresh) {
      return;
    }

    if (refresh) {
      this.transactions = [];
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;

    this.detectChanges();
    try {
      let startDate = new Date(this.startDate),
        endDate = new Date(this.endDate);

      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);

      let opts: any = {
        from: Math.floor(+startDate / 1000),
        to: Math.floor(+endDate / 1000),
        offset: this.offset
      };

      if (this.selectedAddress) {
        opts.address = this.selectedAddress;
      }

      if (this.selectedContract)
        opts.contract = this.selectedContract;

      if (this.remote && this.remoteUser) {
        opts.remote = this.remoteUser;
      }

      let response: any = await this.client.get(`api/v2/blockchain/transactions/ledger`, opts);

      if (refresh) {
        this.transactions = [];
      }

      if (response) {
        this.transactions.push(...(response.transactions || []));
        
        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
          this.inProgress = false;
        }
      } else {
        console.error('No data');
        this.moreData = false;
        this.inProgress = false;
      }
    } catch (e) {
      console.error(e);
      this.moreData = false;
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  onStartDateChange(newDate) {
    this.startDate = newDate;
    this.load(true);
  }

  onEndDateChange(newDate) {
    this.endDate = newDate;
    this.load(true);
  }

  toggleContractsMenu(forceValue?: boolean) {
    if (typeof forceValue !== 'undefined') {
      this.contractsToggle = forceValue;
      return;
    }

    this.contractsToggle = !this.contractsToggle;
  }

  toggleAddressesMenu(forceValue?: boolean) {
    if (typeof forceValue !== 'undefined') {
      this.addressesToggle = forceValue;
      return;
    }

    this.addressesToggle = !this.addressesToggle;
  }

  toggleContract(contract) {
    if (this.selectedContract === contract) {
      this.selectedContract = null;
    } else {
      this.selectedContract = contract;
    }

    if (this.selectedContract === 'offchain:wire') {
      this.toggleAddress(null);
    }

    this.detectChanges();
    this.load(true);
  }

  toggleAddress(address) {
    this.addresses.forEach((item) => {
      item.selected = false;
    });
    if (address) {
      address.selected = true;
    }
    this.selectedAddress = address ? address.address : null;
    this.detectChanges();
    this.load(true);
  }

  getSelf(transaction) {
    if (this.remote) {
      const isSender = transaction.sender.username.toLowerCase() == this.remoteUser.toLowerCase(),
        user = isSender ? transaction.sender : transaction.receiver;

      return {
        avatar: `/icon/${user.guid}/medium/${user.icontime}`,
        username: user.username,
      }
    } else {
      const user = this.session.getLoggedInUser();

      return {
        avatar: `/icon/${user.guid}/medium/${user.icontime}`,
        username: user.username,
      }
    }
  }

  getOther(transaction) {
    const selfUsername = this.remote ? this.remoteUser : this.session.getLoggedInUser().username,
      isSender = transaction.sender.username.toLowerCase() != selfUsername.toLowerCase(),
      user = isSender ? transaction.sender : transaction.receiver;

    return {
      avatar: `/icon/${user.guid}/medium/${user.icontime}`,
      username: user.username,
      isSender,
    }
  }

  isP2p(transaction) {
    const contractName = this.getNormalizedContractName(transaction.contract);

    if (contractName === 'wire' ||contractName == 'offchain wire' || contractName === 'boost') {
      return !!transaction.sender && !!transaction.receiver;
    }
  }

  getNormalizedContractName(contractName) {
    if (contractName.indexOf('offchain:') > -1) {
      const name = contractName.substr(9);
      return name === 'wire' ? 'offchain wire': name;
    }
    return contractName;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
