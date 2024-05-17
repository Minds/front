import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-modal-confirm',
  inputs: ['open', 'yesButton', 'noButton', 'closeAfterAction'],
  outputs: ['actioned', 'closed'],
  templateUrl: 'confirm.html',
})
export class ConfirmModal {
  open: boolean = false;
  closed: EventEmitter<any> = new EventEmitter();
  actioned: EventEmitter<any> = new EventEmitter();
  inProgressEmitter: EventEmitter<any> = new EventEmitter();
  completedEmitter: EventEmitter<any> = new EventEmitter();

  inProgress: boolean = false;
  errorlevel: number = null;

  yesButton: string = 'Yes';
  noButton: string = 'No';
  dismissButton: string = 'Dismiss';
  closeAfterAction: boolean = false;

  constructor() {
    this.inProgressEmitter.subscribe((value: boolean) => {
      this.inProgress = value;
    });

    this.completedEmitter.subscribe((value: number) => {
      if (this.closeAfterAction) {
        this.close(null);
        return;
      }

      this.errorlevel = value;
    });
  }

  close($event) {
    this.open = false;

    this.closed.emit({
      $event: $event,
    });
  }

  action($event) {
    this.actioned.emit({
      $event: $event,
      inProgress: this.inProgressEmitter,
      completed: this.completedEmitter,
    });
  }
}
