import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { SignupModalService } from '../../modals/signup/service';
import { Session } from '../../../services/session';
import { WireModalService } from '../wire-modal.service';
import { WireEventType } from '../v2/wire-v2.service';
import { FeaturesService } from '../../../services/features.service';
import { StackableModalService } from '../../../services/ux/stackable-modal.service';
import { WireCreatorComponent } from '../v2/creator/wire-creator.component';

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
    private overlayModal: OverlayModalService,
    private modal: SignupModalService,
    private wireModal: WireModalService,
    public features: FeaturesService,
    private stackableModal: StackableModalService
  ) {}

  async wire() {
    if (!this.session.isLoggedIn()) {
      this.modal.open();

      return;
    }

    await this.stackableModal
      .present(WireCreatorComponent, this.object, {
        wrapperClass: 'm-modalV2__wrapper',
        default: this.object && this.object.wire_threshold,
        onComplete: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();
  }
}
