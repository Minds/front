import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../notification.service';
import { NotificationsV3Service } from '../notifications-v3.service';

@Component({
  selector: 'm-newNotificationsButton',
  templateUrl: './new-notifications-button.component.html',
  styleUrls: ['./new-notifications-button.component.ng.scss'],
})
export class NewNotificationsButtonComponent {
  count = 0;
  countSubscription: Subscription;
  @Output('loadNew') loadNewEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public v1Service: NotificationService,
    public service: NotificationsV3Service
  ) {}

  ngOnInit() {
    this.countSubscription = this.v1Service.count$.subscribe(
      (count) => (this.count = count)
    );
  }

  ngOnDestroy() {
    this.countSubscription.unsubscribe();
  }

  loadNewNotifications($event) {
    this.loadNewEmitter.emit();
  }
}
