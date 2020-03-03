import { Component, HostBinding, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Session } from '../../services/session';
import { NotificationService } from './notification.service';
import { FeaturesService } from '../../services/features.service';

@Component({
  moduleId: module.id,
  selector: 'm-notifications--topbar-toggle',
  templateUrl: 'toggle.component.html',
})
export class NotificationsTopbarToggleComponent {
  toggled: boolean = false;
  @ViewChild('notificationsFlyout', { static: false }) flyout: any;

  @HostBinding('class.m-notificationsTopbarToggle--newNav')
  newNavigation: boolean = false;

  constructor(
    public session: Session,
    public service: NotificationService,
    private featuresService: FeaturesService
  ) {
    this.newNavigation = this.featuresService.has('navigation');
  }

  toggle(e) {
    this.toggled = !this.toggled;
    if (this.toggled) {
      this.flyout.toggleLoad();
    }
  }
}
