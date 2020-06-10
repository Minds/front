import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { WireV2Service, WireUpgradeType } from '../../wire-v2.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-wireCreator__marketingBlock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'marketing-block.component.html',
})
export class WireCreatorMarketingBlockComponent implements OnInit, OnDestroy {
  /**
   * CDN URL
   */
  readonly cdnAssetsUrl: string;

  upgradeTypeSubscription: Subscription;
  upgradeType: WireUpgradeType;
  /**
   * Constructor. Retrieves CDN URL.
   * @param service
   * @param configs
   */
  constructor(public service: WireV2Service, configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.upgradeTypeSubscription = this.service.upgradeType$.subscribe(
      upgradeType => {
        this.upgradeType = upgradeType;
      }
    );
  }

  ngOnDestroy() {
    if (this.upgradeTypeSubscription) {
      this.upgradeTypeSubscription.unsubscribe();
    }
  }

  /**
   * Build the banner's background CSS properties
   */
  bannerBackgroundImageCss(): any {
    const filename =
      this.upgradeType === 'plus'
        ? 'confetti-concert.png'
        : 'confetti-concert-red.jpg';
    return {
      backgroundImage: `url(${this.cdnAssetsUrl}assets/photos/${filename})`,
    };
  }

  get isPlus(): boolean {
    return this.upgradeType === 'plus';
  }

  get isPro(): boolean {
    return this.upgradeType === 'pro';
  }
}
