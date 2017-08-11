import { Component, Input } from '@angular/core';

import { OverlayModalService } from "../../../services/ux/overlay-modal";
import { WireCreatorComponent } from "../creator/creator.component";

@Component({
  selector: 'm-wire-button',
  template: `
    <button class="m-wire-button" (click)="wire()">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="1em" height="1em" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"
      >
        <path d="M302.7,64L143,288h95.8l-29.5,160L369,224h-95.8L302.7,64L302.7,64z"/>
      </svg>
    </button>
  `
})
export class WireButtonComponent {
  @Input() object: any;

  constructor(private overlayModal: OverlayModalService) { }

  wire() {
    const creator = this.overlayModal.create(WireCreatorComponent, this.object, {
      default: this.object && this.object.wire_threshold,
      onComplete: (wire) => {
        this.object.wire_totals[wire.currency] = wire.amount;
      }
    });
    creator.present();
  }
}
