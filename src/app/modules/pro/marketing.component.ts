import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-pro__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProMarketingComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(protected router: Router) {}

  goToSettings() {
    this.router.navigate(['/pro/settings']);
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
}
