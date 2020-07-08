/**
 * Captcha modal component.
 * Example of usage using the OverlayModalService:
 *
    const modal = this.overlay.create(
      CaptchaModalComponent,
      {},
      {
        class: 'm-captcha--modal-wrapper',
        onComplete: (captcha: Captcha): void => {
          // fire off request with Captcha.
        },
      }
    );
    modal.present();
 *
 * @author Ben Hayward
 */
import { Component } from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { FormToastService } from '../../../common/services/form-toast.service';

export interface OptType {
  onComplete: Function;
}

@Component({
  selector: 'm-captcha__modal',
  template: `
    <div class="m-blogs-captcha__container">
      <h4 class="m-blogs-captcha__header">Verify CAPTCHA</h4>
      <div class="m-blogs-captcha__body">
        <m-captcha name="blog-captcha" [(ngModel)]="captcha"> </m-captcha>
        <div class="m-blogs-captcha__submitButtonContainer">
          <button
            class="m-blogs-captcha__submitButton"
            (click)="onCaptchaSubmit()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CaptchaModalComponent {
  public _opts: OptType;

  /**
   * Pass in OnComplete function to be called when Captcha is submitted.
   */
  public set opts(opts: OptType) {
    this._opts = opts;
  }

  public captcha: string; // bound to [(ngModel)]

  constructor(
    public overlayModal: OverlayModalService,
    private toasterService: FormToastService
  ) {}

  /**
   * Handles on captcha submit
   */
  public onCaptchaSubmit() {
    if (!this.captcha) {
      this.toasterService.error('Please fill out the CAPTCHA');
      return;
    }
    if (typeof this._opts.onComplete !== undefined) {
      this._opts.onComplete(this.captcha);
    }
    this.overlayModal.dismiss();
  }
}
