import { Component } from '@angular/core';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';

@Component({
  selector: 'minds-button-boost',
  inputs: ['object'],
  template: `
    <button class="mdl-button mdl-color-text--white mdl-button--colored mdl-button--raised m-boost-button-fat"
      (click)="boost()">
    <!-- i18n -->Boost<!-- /i18n -->
    </button>
    <m-modal-boost [open]="showModal" (closed)="showModal = false" [object]="object"></m-modal-boost>
  `
})

export class BoostButton {

  object = {
    'guid': null
  };
  session = SessionFactory.build();
  showModal : boolean = false;

  constructor() {
  }

  boost(){
    this.showModal = true;
  }

}
