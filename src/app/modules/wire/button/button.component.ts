import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Session } from '../../../services/session';
import { WireCreatorComponent } from '../v2/creator/wire-creator.component';
import { ModalService } from '../../../services/ux/modal.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';

/**
 * Button that triggers the wire modal
 *
 * Note: "wires" are now called "tips"
 *
 * See it in an activity toolbar of a post that is not your own
 */
@Component({
  selector: 'm-wire-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.ng.scss'],
})
export class WireButtonComponent {
  @Input() object: any;
  @Output('done') doneEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public session: Session,
    private modal: AuthModalService,
    private modalService: ModalService
  ) {}

  async wire() {
    if (!this.session.isLoggedIn()) {
      this.modal.open();

      return;
    }

    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        entity: this.object,
        default: this.object && this.object.wire_threshold,
        onComplete: () => modal.close(),
      },
    });
  }
}
