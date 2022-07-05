import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../../../../../services/session';
import { AttachmentValidationPayload } from '../../../services/attachment-validator.service';

/**
 * Composer modal popup that appears when there's been an error uploading an attachment
 */
@Component({
  selector: 'm-composer__attachmentError',
  templateUrl: './attachment-error.component.html',
  styleUrls: ['./attachment-error.component.ng.scss'],
})
export class AttachmentErrorComponent {
  // array of error codes.
  @Input() error: AttachmentValidationPayload;

  // dismiss intent output used by popup service.
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private session: Session) {}

  /**
   * Whether user is plus or pro.
   * @returns { boolean } - true if user is plus or pro.
   */
  get isPlusOrPro(): boolean {
    const user = this.session.getLoggedInUser();
    return user.plus || user.pro;
  }

  /**
   * Fired on continue click.
   * @returns { void }
   */
  public onContinueClick(): void {
    this.dismissIntent.emit();
  }
}
