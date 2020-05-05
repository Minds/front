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
import { FeaturesService } from '../../services/features.service';
import { Subscription } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'm-notifications--flyout',
  templateUrl: 'flyout.component.html',
})
export class NotificationsFlyoutComponent implements OnDestroy {
  @Input() visible: boolean = false;
  @Output('close') closeEvt: EventEmitter<any> = new EventEmitter();

  @ViewChild('notifications', { static: true }) notificationList: any;

  @HostBinding('class.m-notificationsFlyout--newDesign')
  newNavigation: boolean = false;
  routerSubscription: Subscription = null;

  constructor(
    private featuresService: FeaturesService,
    private router: Router
  ) {
    this.newNavigation = this.featuresService.has('navigation');
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
    this.notificationList.onVisible();
  }
}
