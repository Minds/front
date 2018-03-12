import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OnboardingService } from './onboarding.service';
import { Session } from '../../services/session';
import { OverlayModalService } from '../../services/ux/overlay-modal';

@Component({
  selector: 'm-onboarding--modal',
  templateUrl: 'modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingModalComponent {

  paramsSubscription;
  slide: number = 1;

  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public session: Session,
    private overlayModal: OverlayModalService,
  ) {

  }

  next() {
    this.slide++;
    this.detectChanges();

    if (this.slide > 2) {
      this.overlayModal.dismiss();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
