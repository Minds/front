import { Component } from '@angular/core';

import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { WalletService } from '../../../../services/wallet';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

import { BoostCreatorComponent } from '../../../boost/creator/creator.component';

@Component({
  selector: 'minds-button-boost',
  inputs: ['object'],
  template: `
    <button class="m-btn m-btn--action m-btn--slim"
      (click)="boost()">
    <ng-container i18n="verb|@@M__ACTION__BOOST">Boost</ng-container>
    </button>
  `
})

export class BoostButton {

  object = {
    'guid': null
  };
  showModal: boolean = false;

  constructor(public session: Session, private overlayModal: OverlayModalService) {
  }

  boost() {
    const creator = this.overlayModal.create(BoostCreatorComponent, this.object);
    creator.present();
  }

}
