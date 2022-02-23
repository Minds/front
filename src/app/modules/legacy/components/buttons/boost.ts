import { Component } from '@angular/core';

import { Session } from '../../../../services/session';

import { BoostCreatorComponent } from '../../../boost/creator/creator.component';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { FeaturesService } from '../../../../services/features.service';
import { ModalService } from '../../../../services/ux/modal.service';

@Component({
  selector: 'minds-button-boost',
  inputs: ['object'],
  template: `
    <m-button size="small" color="blue" (onAction)="boost()">
      <ng-container i18n="verb|@@M__ACTION__BOOST">Boost</ng-container>
    </m-button>
  `,
})
export class BoostButton {
  object = {
    guid: null,
  };
  showModal: boolean = false;

  constructor(
    public session: Session,
    private modalService: ModalService,
    private boostLazyModal: BoostModalLazyService,
    private features: FeaturesService
  ) {}

  /**
   * Open boost modal
   * @returns { void }
   */
  public boost(): void {
    if (this.features.has('boost-modal-v2')) {
      this.boostLazyModal.open(this.object);
      return;
    }

    this.modalService.present(BoostCreatorComponent, {
      data: {
        channel: this.object,
      },
    });
  }
}
