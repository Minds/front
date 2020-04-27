import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { SignupModalService } from '../../modals/signup/service';
import { Session } from '../../../services/session';
import { WireModalService } from '../wire-modal.service';
import { WireEventType } from '../v2/wire-v2.service';

@Component({
  selector: 'm-wire-button',
  template: `
    <button
      class="m-btn m-btn--action m-btn--slim m-wire-button"
      (click)="wire()"
    >
      <i class="ion-icon ion-flash"></i>
      <span>Wire</span>
    </button>
  `,
})
export class WireButtonComponent {
  @Input() object: any;
  @Output('done') doneEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public session: Session,
    private overlayModal: OverlayModalService,
    private modal: SignupModalService,
    private wireModal: WireModalService
  ) {}

  async wire() {
    if (!this.session.isLoggedIn()) {
      this.modal.open();

      return;
    }

    const wireEvent = await this.wireModal
      .present(this.object, {
        default: this.object && this.object.wire_threshold,
      })
      .toPromise();

    if (wireEvent.type === WireEventType.Completed) {
      const wire = wireEvent.payload;

      if (this.object.wire_totals) {
        this.object.wire_totals[wire.currency] = wire.amount;
      }

      this.doneEmitter.emit(wire);
    }
  }
}
