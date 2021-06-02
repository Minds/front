import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FeaturesService } from '../../services/features.service';
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

  @ViewChild('notifications', { static: true }) notificationList: any;

  @ViewChild('scrollableArea', { static: false }) scrollableArea: ElementRef;

  @HostBinding('class.m-notificationsFlyout--newDesign')
  newNavigation: boolean = false;

  @HostBinding('class.v3') v3: boolean;

  routerSubscription: Subscription = null;

  scrolledPastTabs: boolean = false;

  constructor(
    private featuresService: FeaturesService,
    private router: Router
  ) {
    this.newNavigation = true;
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.visible) {
        this.close(); // close flyout on route change.
      }
    });
  }

  /**
   * Listen to scroll, fix new notifs button
   */
  onScroll($event) {
    if (this.scrollableArea && this.scrollableArea.nativeElement) {
      this.scrolledPastTabs =
        this.scrollableArea.nativeElement.scrollTop > 50 ? true : false;
    }
  }

  ngOnInit() {
    this.v3 = this.featuresService.has('notifications-v3');
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
