import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-blockchainMarketing__rewards',
  templateUrl: 'rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainMarketingRewardsComponent {
  readonly cdnAssetsUrl: string;

  readonly contributionValues: { [key: string]: number };

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private configs: ConfigsService
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
    this.router.navigate(['/wallet/tokens/contributions']);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
