/**
 * Captcha modal component, including submit button.
 * Appears when the backend requires a captcha (e.g. when publishing a blog)
 *
 * Example of usage using the ModalService:
 *
    const modal = this.modalService.present(
      CaptchaModalComponent,
      {
        class: 'm-captcha--modal-wrapper',
        onComplete: (captcha: Captcha): void => {
          // fire off request with Captcha.
        },
      }
    );
 *
 * @author Ben Hayward
 */
import { Component } from '@angular/core';
import { ToasterService } from '../../../common/services/toaster.service';

export interface OptType {
  onComplete: Function;
  onDismiss: Function;
}

@Component({
  selector: 'm-captcha__modal',
  template: `
    <div class="m-captcha__container">
      <h4 class="m-captcha__header">Verify CAPTCHA</h4>
      <div class="m-captcha__body">
        <m-captcha name="captcha" [(ngModel)]="captcha"> </m-captcha>
        <div class="m-captcha__submitButtonContainer">
          <m-button
            class="m-captcha__submitButton"
            (onAction)="onCaptchaSubmit()"
            data-cy="data-minds-captcha-modal-submit"
          >
            Submit
          </m-button>
        </div>
      </div>
    </div>

    <m-modalCloseButton></m-modalCloseButton>
  `,
})
export class CaptchaModalComponent {
  public _opts: OptType;

  public captcha: string; // bound to [(ngModel)]

  constructor(private toasterService: ToasterService) {}

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
    this._opts.onDismiss();
  }

  /**
   * Pass in OnComplete function to be called when Captcha is submitted.
   */
  setModalData(opts: OptType) {
    this._opts = opts;
  }
}
