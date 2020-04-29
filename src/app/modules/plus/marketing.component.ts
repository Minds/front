import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';
import { Session } from '../../services/session';

@Component({
  selector: 'm-plus__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMarketingComponent {
  showVerifyModal: boolean = false;

  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor', { static: false })
  readonly topAnchor: ElementRef;

  constructor(
    protected cd: ChangeDetectorRef,
    configs: ConfigsService,
    private session: Session
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

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
    return (
      this.session.getLoggedInUser() && this.session.getLoggedInUser().plus
    );
  }

  get isVerified() {
    return (
      this.session.getLoggedInUser() && this.session.getLoggedInUser().verified
    );
  }
}
