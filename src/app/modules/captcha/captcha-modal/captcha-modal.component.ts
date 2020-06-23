import { Component, Output, EventEmitter } from '@angular/core';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { FormToastService } from '../../../common/services/form-toast.service';

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
  public _opts: {
    onComplete: Function;
  };

  public set opts(opts: any) {
    this._opts = opts;
  }

  public captcha: string;

  constructor(
    public overlayModal: OverlayModalService,
    private toasterService: FormToastService
  ) {}

  public onCaptchaSubmit = () => {
    if (!this.captcha) {
      this.toasterService.error('Please fill out the CAPTCHA');
      return;
    }
    if (typeof this._opts.onComplete !== undefined) {
      this._opts.onComplete(this.captcha);
    }
    this.overlayModal.dismiss();
  };
}
