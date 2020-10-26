import { Injectable } from '@angular/core';
import { BigNumberish, Contract, utils } from 'ethers';
import { Web3Provider, ExternalProvider } from '@ethersproject/providers';
import BN from 'bn.js';
import { ConfigsService } from '../../common/services/configs.service';
import { Web3ModalService } from '@dorgtech/web3modal-angular';
import { Interface } from 'ethers/lib/utils';

type Address = string;

@Injectable()
export class Web3Service {
  public config: any;
  public provider: Web3Provider | null = null;

  constructor(
    private configs: ConfigsService,
    private web3modalService: Web3ModalService
  ) {
    this.config = this.configs.get('blockchain');

    console.log(this.config);
  }

  async initializeProvider() {
    if (!this.provider) {
      const provider = await this.web3modalService.open();
      this.setProvider(provider);
    }

    return this.provider;
  }

  public getSigner() {
    if (this.provider) {
      return this.provider.getSigner();
    }

    return null;
  }

  getABIInterface(abi: any) {
    return new Interface(abi);
  }

  public setProvider(provider: ExternalProvider) {
    this.provider = new Web3Provider(provider);
  }

  public async getContract(address: Address, abi: string[]): Promise<Contract> {
    const signer = await this.getSigner();

    return new Contract(address, abi, signer);
  }

  public fromWei(amount: BN, unit?: BigNumberish): string {
    const etherAmount = utils.formatUnits(amount.toString(), unit);
    return etherAmount.toString();
  }

  public toWei(amount: string | number, unit?: BigNumberish): BN {
    const weiAmount = utils.parseUnits(amount.toString(), unit);
    return new BN(weiAmount.toString());
  }
}
