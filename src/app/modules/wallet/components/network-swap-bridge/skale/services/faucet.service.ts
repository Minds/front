import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BigNumber } from 'ethers';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiService } from '../../../../../../common/api/api.service';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { FormToastService } from '../../../../../../common/services/form-toast.service';
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';

/**
 * Service for requesting funds from the SKALE faucet.
 */
@Injectable({ providedIn: 'root' })
export class SkaleFaucetService {
  constructor(
    private api: ApiService,
    private toast: FormToastService,
    private config: ConfigsService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService
  ) {}

  /**
   * Request from the faucet.
   * @param { string } address - address to request for.
   * @returns { Observable<HttpResponse<any> | void> } - observable of http response or void.
   */
  public request(address: string): Observable<HttpResponse<any> | void> {
    this.toast.warn('Sending request for skETH - please wait');
    return this.api
      .post('api/v3/blockchain/skale/faucet', {
        address: address,
      })
      .pipe(
        take(1),
        map(response => {
          this.toast.success(
            'Sent funds to your wallet for gas - please wait for a short while and try again'
          );
        }),
        catchError(e => {
          if (
            e?.error?.errorId ===
            'Minds::Core::Security::RateLimits::RateLimitExceededException'
          ) {
            this.toast.error(
              'You have already received skETH in the last week'
            );
          } else {
            this.toast.error(
              e?.error?.message ??
                'An error has occurred requesting funds from the faucet'
            );
          }
          return EMPTY;
        })
      );
  }

  /**
   * Threshold for when a users balance is low enough that they can claim from the faucet.
   * @returns { string } - threshold in wei.
   */
  public getClaimThresholdWei(): string {
    return (
      this.config.get('blockchain')['skale']['faucet_claim_threshold_wei'] ??
      '8801000000'
    );
  }

  /**
   * Whether user can request funds from faucet.
   * @returns { boolean } - true if user can request funds.
   */
  public async canRequest(): Promise<boolean> {
    if (!this.networkSwitch.isOnNetwork(this.networkSwitch.networks.skale.id)) {
      return false;
    }

    const signer = this.web3Wallet.getSigner();

    if (!signer) {
      return false;
    }

    const balanceWei = await this.web3Wallet.getSigner().getBalance();

    const lowBalanceThreshold = BigNumber.from(this.getClaimThresholdWei());

    return balanceWei.lt(lowBalanceThreshold);
  }
}
