import { Component } from '@angular/core';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-newsfeed-poster--modal',
  template: `
    <minds-newsfeed-poster (load)="onLoad($event)"></minds-newsfeed-poster>
  `
})

export class ModalPosterComponent {

  constructor(private overlayModal: OverlayModalService) {
  }

  onLoad(e) {
    setTimeout(() => {
      this.overlayModal.dismiss();
    }, 500);
  }
}
