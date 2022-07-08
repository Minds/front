import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { BlockchainMarketingLinksService } from './blockchain-marketing-links.service';

/**
 * Multi-page tokens marketing component
 */
@Component({
  selector: 'm-blockchainMarketing__token--v2',
  templateUrl: 'token.component.html',
  styleUrls: ['./token.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainMarketingTokenV2Component extends AbstractSubscriberComponent {
  public readonly cdnAssetsUrl: string;
  public readonly siteUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  @ViewChild('composerOpenAnchor') readonly composerOpenAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private linksService: BlockchainMarketingLinksService,
    private session: Session,
    private toast: ToasterService,
    configs: ConfigsService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      fromEvent(this.composerOpenAnchor.nativeElement, 'click').subscribe(
        $event => {
          if (!this.session.isLoggedIn()) {
            this.router.navigate(['/']);
            return;
          }
          this.openComposerModal();
        }
      )
    );
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

  /**
   * Called on purchase completed.
   * @returns { void }
   */
  public onPurchaseComplete($event): void {
    // do nothing
  }

  /**
   * Opens composer modal
   * @returns { BlockchainMarketingTokenComponent } - Chainable.
   */
  public openComposerModal(): void {
    this.linksService.openComposerModal();
  }

  /**
   * Open provide liquidity modal.
   * @returns { void }
   */
  public provideLiquidityClick() {
    this.linksService.openLiquidityProvisionModal();
  }

  /**
   * Open referrals page.
   * @returns { void }
   */
  public navigateToReferrals(): void {
    this.linksService.navigateToReferrals();
  }

  /**
   * Open hold modal.
   * @returns { void }
   */
  public holdClick(): void {
    this.linksService.openTransferOnchainModal();
  }

  /**
   * Open airdrop modal.
   * @returns { void }
   */
  public airdropClick(): void {
    this.toast.warn('Coming soon!');
    // this.linksService.openAirdropModal();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
