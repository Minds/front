import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-blockchainMarketing__token',
  templateUrl: 'token.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainMarketingTokenComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(protected router: Router, protected cd: ChangeDetectorRef) {}

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  onPurchaseComplete(purchase: any) {}

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
