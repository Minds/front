import { Component } from '@angular/core';

const noOp = () => {};
const DEFAULT_TITLE = 'Confirm';
const DEFAULT_BODY = 'Are you sure?';

/**
 * Generic confirmation modal with changeable title and body
 */
@Component({
  selector: 'm-modal-confirmV2',
  template: `
    <div class="m-confirmV2Modal__textWrapper">
      <h2 class="m-confirmV2Modal__title">{{ title }}</h2>
      <span class="m-confirmV2Modal__text">{{ body }}</span>
    </div>
    <div class="m-confirmV2Modal__buttonWrapper">
      <button class="m-confirmV2Modal__cancelButton" (click)="onDismiss()">
        Cancel
      </button>
      <button class="m-confirmV2Modal__confirmButton" (click)="onConfirm()">
        Confirm
      </button>
    </div>
  `,
  styleUrls: ['./confirm.ng.scss'],
})
export class ConfirmV2Component {
  /**
   * Title displayed at top of modal
   */
  public title: string = DEFAULT_TITLE;

  /**
   * Body of text displayed within the modal
   */
  public body: string = DEFAULT_BODY;

  /**
   * Triggered on confirm click
   */
  public onConfirm: () => any = noOp;

  /**
   * Triggered on cancel click
   */
  public onDismiss: () => void = noOp;

  /**
   * Modal options.
   * @param { string } title - title of the modal
   * @param { string } body - text body of the component
   * @param { function } onConfirm - callback on call for confirmation.
   * @param { function } onDismiss - callback on call to dismiss modal.
   */
  set opts({ title, body, onConfirm, onDismiss }) {
    this.title = title || DEFAULT_TITLE;
    this.body = body || DEFAULT_BODY;
    this.onConfirm = onConfirm || noOp;
    this.onDismiss = onDismiss || noOp;
  }
}
