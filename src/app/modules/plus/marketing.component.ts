import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'm-plus__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMarketingComponent {
  showVerifyModal: boolean = false;

  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  readonly minds = window.Minds;

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(protected cd: ChangeDetectorRef) {}

  openVerifyModal() {
    this.showVerifyModal = true;
  }

  closeVerifyModal() {
    this.showVerifyModal = false;
    this.detectChanges();
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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get isPlus() {
    return this.minds.user && this.minds.user.plus;
  }

  get isVerified() {
    return this.minds.user && this.minds.user.verified;
  }
}
