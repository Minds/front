import { Component } from '@angular/core';

const noOp = () => {};
const DEFAULT_TITLE = 'Confirm';
const DEFAULT_BODY = 'Are you sure?';

/**
 * Generic confirmation modal with changeable title and body
 */
@Component({
  selector: 'm-confirmationModal',
  templateUrl: 'confirm.html',
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
   * Colour of confirm button.
   */
  public confirmButtonColor: string = 'blue';

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
   * @param { string } title - title of the modal.
   * @param { string } body - text body of the component.
   * @param { string } confirmButtonColor - color of the confirm button.
   * @param { function } onConfirm - callback on call for confirmation.
   * @param { function } onDismiss - callback on call to dismiss modal.
   */
  setModalData({ title, body, confirmButtonColor, onConfirm, onDismiss }) {
    this.title = title || DEFAULT_TITLE;
    this.body = body || DEFAULT_BODY;
    this.confirmButtonColor = confirmButtonColor || 'blue';
    this.onConfirm = onConfirm || noOp;
    this.onDismiss = onDismiss || noOp;
  }
}
