import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-paywall-cancel-button',
  templateUrl: 'paywall-cancel.component.html'
})
export class PaywallCancelButton {
  @Input() target: string;
  @Output() completed: EventEmitter<any> = new EventEmitter();

  inProgress: boolean = false;

  constructor(private client: Client) {
  }

  action() {
    if (this.inProgress || !this.target) {
      return;
    }

    this.inProgress = true;

    this.client.delete(`api/v1/payments/plans/exclusive/${this.target}`)
      .then((response: any) => {
        this.inProgress = false;
        this.completed.emit();
      })
      .catch(e => {
        this.inProgress = false;
        console.error(e);
      });
  }
}
