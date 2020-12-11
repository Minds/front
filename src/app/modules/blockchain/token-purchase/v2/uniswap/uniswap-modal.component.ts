import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { BuyTokensModalService } from '../buy-tokens-modal.service';
import { UniswapAction } from './uniswap-modal.service';

@Component({
  selector: 'm-uniswap__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'uniswap-modal.component.html',
  styleUrls: ['./uniswap-modal.component.scss'],
})
export class UniswapModalComponent {
  private baseUrl = 'https://app.uniswap.org/#';
  public action: UniswapAction;
  public iframeUrl: string;

  @Input('action') set data(action) {
    this.action = action;

    const mindsTokenAddress = this.configService.get('blockchain').token
      .address;

    if (this.action === 'swap') {
      this.iframeUrl = `${this.baseUrl}/${this.action}?outputCurrency=${mindsTokenAddress}`;
    } else {
      this.iframeUrl = this.iframeUrl = `${this.baseUrl}/${this.action}/ETH/${mindsTokenAddress}`;
    }
  }

  constructor(
    private configService: ConfigsService,
    private buyTokensModalService: BuyTokensModalService
  ) {}

  async openBuyTokens() {
    await this.buyTokensModalService.open();
  }
}
