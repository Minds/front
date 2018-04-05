import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Session } from '../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-notifications--topbar-toggle',
  templateUrl: 'toggle.component.html'
})

export class NotificationsTopbarToggleComponent {

  toggled: boolean = false;
  minds: any = window.Minds;
  @ViewChild('notificationsFlyout') flyout: any;
  
  constructor(
    public session: Session,
  ) {

  }

  toggle(e){
    this.toggled = !this.toggled;
    if (this.toggled) {
      this.flyout.toggleLoad();
    }
  }

}
