import { Component } from '@angular/core';
import { SkaleService } from '../skale.service';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

/**
 * SKALE Community Pool component, giving users the ability to
 * deposit and withdraw from community pool, which is used for funding
 * SKALE chain exits.
 */
@Component({
  selector: 'm-wallet__skaleCommunityPool',
  templateUrl: 'community-pool.component.html',
  styleUrls: ['./community-pool.component.ng.scss'],
})
export class WalletSkaleCommunityPoolComponent {
  // amount we are transacting.
  public amount: number = 0;

  // form for input amount.
  public form: FormGroup;

  // current community pool balance.
  public communityPoolBalance: number = 0;

  constructor(private service: SkaleService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.001),
          // will update as max changes
          (control: AbstractControl) =>
            Validators.max(this.communityPoolBalance)(control),
        ],
      }),
    });

    // get balance async so we don't hold up load.
    this.getDepositedBalance();
  }

  /**
   * On deposit clicked.
   * @returns { void }
   */
  public depositCommunityPool(): void {
    this.service.depositCommunityPool(this.amount);
  }

  /**
   * On withdraw clicked.
   * @returns { void }
   */
  public withdrawCommunityPool(): void {
    this.service.withdrawCommunityPool(this.amount);
  }

  /**
   * Gets currently deposited balance from service and sets class variable communityPoolBalance accordingly.
   * @returns { Promise<void> }
   */
  private async getDepositedBalance(): Promise<void> {
    const balance = await this.service.getCommunityPoolBalance();
    this.communityPoolBalance = balance;
  }
}
