import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'm-pay__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayMarketingComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(protected cd: ChangeDetectorRef) {}

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
