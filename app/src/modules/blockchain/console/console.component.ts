import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

import { BlockchainService } from '../blockchain.service';
import { Web3WalletService } from '../web3-wallet.service';

@Component({
  moduleId: module.id,
  selector: 'm-blockchain--console',
  templateUrl: 'console.component.html'
})
export class BlockchainConsoleComponent implements OnInit {
  inProgress: boolean = false;
  form: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private blockchain: BlockchainService,
    private route: ActivatedRoute,
    private web3Wallet: Web3WalletService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      address: ['', Validators.pattern(/^0x[a-fA-F0-9]{40}$/)],
    });

    this.getWallet();
  }

  async getWallet() {
    this.error = '';
    this.inProgress = true;

    try {
      const address = await this.blockchain.getWallet(true);

      if (address) {
        this.form.controls.address.setValue(address);
      } else if (this.route.snapshot.params.auto) {
        await this.web3Wallet.ready();

        let localWallet = await this.web3Wallet.getCurrentWallet();

        if (localWallet) {
          this.form.controls.address.setValue(localWallet);
        }
      }
    } catch (e) {
      this.error = (e && e.message) || 'There was an issue getting your saved wallet info';
    } finally {
      this.inProgress = false;
    }
  }

  async setWallet() {
    this.error = '';
    this.inProgress = true;

    try {
      await this.blockchain.setWallet(this.form.value);
    } catch (e) {
      this.error = (e && e.message) || 'There was an issue saving the wallet info';
    } finally {
      this.inProgress = false;
    }
  }
}
