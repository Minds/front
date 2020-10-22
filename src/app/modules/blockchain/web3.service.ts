import { Injectable } from '@angular/core';
import { Contract, utils } from 'ethers';
import { Web3Provider, ExternalProvider } from '@ethersproject/providers';
import BN from 'bn.js';
import { ConfigsService } from '../../common/services/configs.service';

type Address = string;

@Injectable()
export class Web3Service {
  public config: any;
  public provider?: Web3Provider;

  constructor(private configs: ConfigsService) {
    this.config = this.configs.get('blockchain');

    console.log(this.config);
  }

  public setProvider(provider: ExternalProvider) {
    this.provider = new Web3Provider(provider);
  }

  public getContract(address: Address, abi: string[]): Contract {
    if (!this.provider) {
      throw new Error('Please call `setProvider` before calling `getContract`');
    }

    return new Contract(address, abi, this.provider.getSigner());
  }

  public async callView(
    address: Address,
    method: string,
    args: string
  ): Promise<string> {
    const contract = this.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    if (args[0] !== '[') {
      args = `[${args}]`;
    }
    const parsedArgs = JSON.parse(args);
    const res = await contract[funcs[0]](...parsedArgs);
    return res.toString();
  }

  public async sendTransaction(
    address: Address,
    method: string,
    args: string
  ): Promise<string> {
    const contract = this.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    if (args[0] !== '[') {
      args = `[${args}]`;
    }
    const parsedArgs = JSON.parse(args);
    const tx = await contract[funcs[0]](...parsedArgs);

    return tx;
  }

  public fromWei(amount: BN): string {
    const etherAmount = utils.formatEther(amount.toString());
    return etherAmount.toString();
  }

  public toWei(amount: string | number): BN {
    const weiAmount = utils.parseEther(amount.toString());
    return new BN(weiAmount.toString());
  }
}
