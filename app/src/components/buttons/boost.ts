import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';
import { BoostModal } from '../modal/modal';

@Component({
  selector: 'minds-button-boost',
  inputs: ['object']
})
@View({
  template: `
    <button class="mdl-button mdl-color-text--white mdl-button--colored mdl-button--raised m-boost-button-fat"
      (click)="boost()">
    Boost
    </button>
    <m-modal-boost [open]="showModal" (closed)="showModal = false" [object]="object"></m-modal-boost>
  `,
  directives: [CORE_DIRECTIVES, BoostModal]
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
