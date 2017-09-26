import { Component, Input } from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { SignupModalService } from '../../modals/signup/service';
import { WireCreatorComponent } from '../creator/creator.component';
import { Session, SessionFactory } from '../../../services/session';

@Component({
  selector: 'm-wire-button',
  template: `
    <button class="m-wire-button" (click)="wire()">
      <i class="ion-icon ion-flash"></i>
    </button>
  `
})
export class WireButtonComponent {
  @Input() object: any;

  session: Session = SessionFactory.build();

  constructor(private overlayModal: OverlayModalService, private modal: SignupModalService) { }

  wire() {
    if (!this.session.isLoggedIn()) {
      this.modal.open();

      return;
    }

    const creator = this.overlayModal.create(WireCreatorComponent, this.object, {
      default: this.object && this.object.wire_threshold,
      onComplete: (wire) => {
        if (this.object.wire_totals) {
          this.object.wire_totals[wire.currency] = wire.amount;
        }
      }
    });
    creator.present();
  }
}
