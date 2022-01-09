import { Component, OnInit } from '@angular/core';
import { InputBalance } from './polygon.types';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolygonService } from './polygon.service';
import { ethers } from 'ethers';

/**
 * SKALE component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon',
  templateUrl: 'polygon.component.html',
  styleUrls: ['./polygon.component.ng.scss'],
})
export class WalletPolygonComponent implements OnInit {
  // amount we are transacting.
  public amount = '0';

  // balance, held with active input currency for display purposes.
  public balance: InputBalance = {
    root: 0,
    child: 0,
  };

  // token allowance
  public allowance = 0;

  // form for input amount
  public form: FormGroup;

  constructor(private service: PolygonService) {}

  /**
   * Max amount a user can input - returns the lowest of allowance and balance amount.
   * @returns { number } - maximum amount a user can input.
   */
  setMaxAmount() {
    this.amount = this.balance.root.toString();
  }

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [Validators.required, Validators.min(0.001)],
      }),
    });

    await this.service.initialize();
    await this.initBalance();
  }

  /**
   * Calls to approve amount via the service.
   * @returns { void }
   */
  public async approve() {
    await this.service.approve(ethers.utils.parseUnits(this.amount, 18));
  }

  /**
   * Swaps input currency fields around by swapping networks
   * and triggering a reload.
   * @returns { void }
   */
  public async swapNetworks() {
    if (this.service.isOnMainnet()) {
      await this.service.switchNetworkPolygon();
    } else {
      await this.service.switchNetworkMainnet();
    }
    await this.initBalance();
  }

  /**
   * Calls to deposit via service.
   * @returns { void }
   */
  async deposit() {
    await this.service.deposit(ethers.utils.parseUnits(this.amount, 18));
  }

  /**
   * Calls to withdraw via the service.
   * @returns { void }
   */
  async withdraw() {
    await this.service.withdraw(ethers.utils.parseUnits(this.amount, 18));
  }

  /**
   * Inits balances and calls to get allowance.
   * @returns { Promise<void> }
   */
  private async initBalance(): Promise<void> {
    try {
      const balances = await this.service.getBalances();
      this.balance = {
        root: parseFloat(ethers.utils.formatEther(balances.root)),
        child: parseFloat(ethers.utils.formatEther(balances.child)),
      };
    } catch (err) {
      console.warn('error fetching balances', err);
    }
  }
}
