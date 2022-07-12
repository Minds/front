import { ModalService } from './../../services/ux/modal.service';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';
import { Session } from '../../services/session';
import { PlusVerifyComponent } from './verify/verify.component';

/**
 * Marketing page for Minds+
 *
 * See it at /plus
 */
@Component({
  selector: 'm-plus__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['marketing.component.ng.scss'],
})
export class PlusMarketingComponent {
  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  constructor(
    protected cd: ChangeDetectorRef,
    configs: ConfigsService,
    private session: Session,
    private modalService: ModalService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  openVerifyModal() {
    this.modalService.present(PlusVerifyComponent);
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
