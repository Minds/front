import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsComponent } from './notifications.component';

@Component({
  moduleId: module.id,
  selector: 'm-notifications--flyout',
  templateUrl: 'flyout.component.html'
})

export class NotificationsFlyoutComponent {

  @Input() item: any;
  @Output('close') closeEvt: EventEmitter<any> = new EventEmitter();

  close() {
    this.closeEvt.emit(true);
  }

}
