import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'm-notifications--flyout',
  templateUrl: 'flyout.component.html',
  styleUrls: ['./flyout.component.ng.scss'],
})
export class NotificationsFlyoutComponent implements OnDestroy {
  @Input() visible: boolean = false;
  @Output('close') closeEvt: EventEmitter<any> = new EventEmitter();

  @ViewChild('notifications', { static: false }) notificationList: any;

  routerSubscription: Subscription = null;

  constructor(private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.visible) {
        this.close(); // close flyout on route change.
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  close() {
    this.closeEvt.emit(true);
  }

  toggleLoad() {
    if (this.notificationList) {
      this.notificationList.onVisible();
    }
  }
}
