import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../common/services/configs.service';
import { BlockchainMarketingLinksService } from './blockchain-marketing-links.service';

/**
 * Rewards marketing page
 */
@Component({
  selector: 'm-blockchainMarketing__rewards--v2',
  templateUrl: 'rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./rewards.component.ng.scss'],
})
export class BlockchainMarketingRewardsV2Component {
  readonly cdnAssetsUrl: string;

  readonly contributionValues: { [key: string]: number };

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private linksService: BlockchainMarketingLinksService,
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
   * Opens composer modal.
   * @returns { void }
   */
  public openComposerModal(): void {
    this.linksService.openComposerModal();
  }

  /**
   * Open referrals page.
   * @returns { void }
   */
  public navigateToReferrals(): void {
    this.linksService.navigateToReferrals();
  }

  /**
   * Open whitepaper.
   * @returns { void }
   */
  public navigateToWhitepaper(): void {
    this.linksService.navigateToWhitepaper();
  }

  /**
   * Open explanatory blog.
   * @returns { void }
   */
  public navigateToBlog(): void {
    this.linksService.navigateToBlog();
  }

  /**
   * Open join rewards modal.
   * @returns { void }
   */
  public joinRewardsClick(): void {
    this.linksService.navigateToJoinRewards();
  }

  /**
   * Open buy tokens modal.
   * @returns { void }
   */
  public buyTokensClick() {
    this.linksService.openBuyTokensModal();
  }

  /**
   * Open provide liquidity modal.
   * @returns { void }
   */
  public provideLiquidityClick(): void {
    this.linksService.openLiquidityProvisionModal();
  }

  /**
   * Open transfer on-chain modal.
   * @returns { void }
   */
  public transferOnChainClick(): void {
    this.linksService.openTransferOnchainModal();
  }

  /**
   * Called on purchase completed.
   * @returns { void }
   */
  public onPurchaseComplete($event): void {
    // do nothing
  }

  public detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
