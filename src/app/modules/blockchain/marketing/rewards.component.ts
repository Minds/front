import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-blockchainMarketing__rewards',
  templateUrl: 'rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainMarketingRewardsComponent {
  readonly cdnAssetsUrl: string;

  readonly contributionValues: { [key: string]: number };

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private features: FeaturesService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.contributionValues = configs.get('contribution_values');
  }

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  action() {
    this.router.navigate(['/wallet/tokens/overview']);
  }

  /**
   * Returns whether token-marketing-2021 is enabled (v2).
   * @returns { boolean } true if feature flag for v2 is enabled.
   */
  public isV2(): boolean {
    return this.features.has('token-marketing-2021');
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
