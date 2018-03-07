import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsComponent } from './notifications.component';

@Component({
  moduleId: module.id,
  selector: 'm-notifications--flyout',
  templateUrl: 'flyout.component.html'
})

export class NotificationsFlyoutComponent {

  @Input() visible:boolean = false;
  @Output('close') closeEvt: EventEmitter<any> = new EventEmitter();

  @ViewChild('notifications') notificationList: any

  close() {
    this.closeEvt.emit(true);
  }

  toggleLoad() {
    this.notificationList.onVisible();
  }
}
