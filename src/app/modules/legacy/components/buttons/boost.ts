import { Component } from '@angular/core';

import { Session } from '../../../../services/session';

import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { FeaturesService } from '../../../../services/features.service';
import { ModalService } from '../../../../services/ux/modal.service';

/**
 * Boost button that opens boost modal when clicked.
 * Seen on the bottom bar of blogs.
 */
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
    this.boostLazyModal.open(this.object);
  }
}
