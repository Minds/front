import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsComponent } from './notifications.component';
import { FeaturesService } from '../../services/features.service';

@Component({
  moduleId: module.id,
  selector: 'm-notifications--flyout',
  templateUrl: 'flyout.component.html',
})
export class NotificationsFlyoutComponent {
  @Input() visible: boolean = false;
  @Output('close') closeEvt: EventEmitter<any> = new EventEmitter();

  @ViewChild('notifications', { static: true }) notificationList: any;

  @HostBinding('class.m-notificationsFlyout--newDesign')
  newNavigation: boolean = false;

  constructor(private featuresService: FeaturesService) {
    this.newNavigation = this.featuresService.has('navigation');
  }

  close() {
    this.closeEvt.emit(true);
  }

  toggleLoad() {
    this.notificationList.onVisible();
  }
}
