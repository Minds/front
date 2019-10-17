import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'm-plus--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMarketingComponent {
  showVerifyModal: boolean = false;

  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  readonly minds = window.Minds;

  constructor(protected cd: ChangeDetectorRef) {}

  openVerifyModal() {
    this.showVerifyModal = true;
  }

  closeVerifyModal() {
    this.showVerifyModal = false;
    this.detectChanges();
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
