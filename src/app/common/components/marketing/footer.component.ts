import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'm-marketing__footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'footer.component.html',
})
export class MarketingFooterComponent implements OnInit {
  readonly year: number = new Date().getFullYear();

  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;
  isMobile: boolean;

  constructor(protected cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 480;

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
