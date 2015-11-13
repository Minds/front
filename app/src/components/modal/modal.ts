import {Component} from 'angular2/angular2';

@Component({
  selector: 'm-modal',
  host: {
    '[hidden]': 'hidden'
  },
  template: `
    <div class="m-modal-bg" (click)="close()"></div>
    <div class="m-modal-container">
      <div class="mdl-card mdl-shadow--2dp">
        <ng-content></ng-content>
        <div class="mdl-card__menu" (click)="close()"><i class="material-icons mdl-color-text--blue-grey-300">close</i></div>
      </div>
    </div>
  `
})

export class Modal {

  hidden : boolean = false;

  close(){
    this.hidden = true;
  }

}

export { SignupModal } from './signup/signup';
