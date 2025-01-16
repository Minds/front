import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SkipSelf,
} from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';
import { UniswapAction } from './uniswap-modal.service';

/**
 * Uniswap modal (appears when you click 'Provide liquidity' in token wallet, for example)
 */
@Component({
  selector: 'm-uniswap__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'uniswap-modal.component.html',
  styleUrls: ['./uniswap-modal.component.ng.scss'],
})
export class UniswapModalComponent {
  private baseUrl = 'https://app.uniswap.org';
  public action: UniswapAction;
  public iframeUrl: string;

  setModalData({ action }) {
    this.action = action;

    const mindsTokenAddress =
      this.configService.get('blockchain').token.address;

    const useV2 = true;

    if (this.action === 'swap') {
      this.iframeUrl = `${this.baseUrl}/${this.action}?outputCurrency=${mindsTokenAddress}`;
      if (useV2) {
        this.iframeUrl += '&use=v2';
      }
    } else {
      this.iframeUrl = `${this.baseUrl}/positions`;
    }
  }

  constructor(private configService: ConfigsService) {}
}
