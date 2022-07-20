import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WalletOnchainTransfersSummaryService } from './onchain-transfers.service';
import { Withdrawal } from './onchain-transfers.types';

/**
 * Displays a summary of a users withdrawals
 * from their off-chain to on-chain wallet.
 *
 * See it at wallet > tokens > on-chain transfers
 */
@Component({
  selector: 'm-walletTransactions--onchainTransfers',
  templateUrl: 'onchain-transfers.component.html',
  styleUrls: ['./onchain-transfers.component.ng.scss'],
})
export class WalletOnchainTransfersSummaryComponent implements OnInit {
  // withdrawals subject
  public readonly withdrawals$: BehaviorSubject<
    Withdrawal[]
  > = new BehaviorSubject<Withdrawal[]>([]);

  // whether request is in progress
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // paging token
  public pagingToken: string = '';

  constructor(
    private service: WalletOnchainTransfersSummaryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.load();
  }

  /**
   * Load withdrawals async - When called a multiple times,
   * loads next withdrawals using paging token.
   * @returns { Promise<void> } - awaitable.
   */
  public async load(): Promise<void> {
    this.inProgress$.next(true);

    try {
      const response = await this.service
        .getWithdrawals$(this.pagingToken)
        .toPromise();

      if (response && response.withdrawals) {
        this.withdrawals$.next([
          ...this.withdrawals$.getValue(),
          ...response.withdrawals,
        ]);
      }
      this.pagingToken = response['load-next'];
    } catch (e) {
      // error handled in service, catch to set progress to false below.
    }
    this.inProgress$.next(false);
  }

  /**
   * Opens explorer - currently only supports Etherscan for ETH mainnet.
   * @param { string } txid - valid TXID
   * @returns { Promise<void> } - awaitable.

   */
  public async openExplorer(txid: string): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).open(`https://etherscan.com/tx/${txid}`, '_blank');
    }
  }

  /**
   * Truncates middle of address e.g. 0xda...10a0
   * @param { string } address - address to truncate.
   * @returns { string } truncated address.
   */
  public truncateAddress(address): string {
    if (!address) {
      return '';
    }
    return address.substr(0, 4) + '...' + address.substr(-4);
  }
}
