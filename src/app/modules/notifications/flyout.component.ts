import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FeaturesService } from '../../services/features.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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
    private router: Router,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.newNavigation = this.featuresService.has('navigation');
    this.routerSubscription = this.router.events.subscribe(event => {
      if (isPlatformBrowser(this.platformId)) {
        if (window.innerWidth < 1028) {
          if (event instanceof NavigationStart && this.visible) {
            this.close(); // close flyout on route change.
          }
        }
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
