import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Reason, rejectionReasons } from '../../../boost/rejection-reasons';

@Component({
  moduleId: module.id,
  selector: 'm--rejection-reason-modal',
  outputs: ['actioned', 'closed'],
  templateUrl: 'rejection-reason-modal.component.html',
})
export class RejectionReasonModalComponent {
  @Input() boost;

  @Input() yesButton: string = 'Yes';
  @Input() noButton: string = 'No';
  @Input() closeAfterAction: boolean = false;

  @Output() closed: EventEmitter<any> = new EventEmitter();
  @Output() actioned: EventEmitter<any> = new EventEmitter();

  errorlevel: number = null;
  dismissButton: string = 'Dismiss';
  reasons: Array<Reason> = rejectionReasons;

  open: boolean = true;

  close() {
    this.open = false;

    this.closed.emit();
  }

  action() {
    this.actioned.emit(this.boost);
  }

  selectReason(reason: Reason) {
    this.boost.rejection_reason = reason.code;
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    e.stopPropagation();

    if (e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }

    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      // numbers
      const index = Number.parseInt(e.key) - 1;
      if (index >= 0 && index <= this.reasons.length - 1) {
        return this.selectReason(rejectionReasons[index]);
      }
    }

    if (e.keyCode === 13) {
      // enter
      if (this.boost.rejection_reason !== -1) {
        return this.action();
      }
    }

    if (e.keyCode === 27) {
      // escape
      return this.close();
    }
  }
}
