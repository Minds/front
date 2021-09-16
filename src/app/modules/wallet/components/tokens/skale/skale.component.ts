import { Component, OnInit } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { SkaleService } from './skale.service';
/**
 * SKALE
 */
@Component({
  selector: 'm-wallet__skale',
  templateUrl: 'skale.component.html',
  styleUrls: ['./skale.component.ng.scss'],
})
export class WalletSkaleSummaryComponent implements OnInit {
  public amount: number;
  public mindsTokenBalance: string;

  constructor(private service: SkaleService) {}

  ngOnInit(): void {
    this.getMainnetTokenBalance().then(balance => {
      this.mindsTokenBalance = (balance / 1000000000000000000).toString();
    });
  }

  public deposit(): void {
    this.service.deposit(this.amount ?? 0);
  }

  public withdraw(): void {
    this.service.withdraw();
  }

  public approve(): void {
    this.service.approve(this.amount ?? 0);
  }

  public switchNetworkRinkeby(): void {
    this.service.switchNetworkRinkeby();
  }

  public switchNetworkSkale(): void {
    this.service.switchNetworkSkale();
  }

  public async getMainnetTokenBalance(): Promise<number> {
    return this.service.getMainnetTokenBalance();
  }
}
