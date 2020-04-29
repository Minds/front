import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Session } from '../../../services/session';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnnouncementComponent } from '../announcements/announcement.component';
import { OnboardingWrapperService } from '../../../modules/channels/service/onboarding-wrapper.service';

@Component({
  selector: 'm-onboardingReminder',
  templateUrl: 'reminder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingReminderComponent implements OnInit, OnDestroy {
  shouldShow: boolean = false;

  @ViewChild('announcement', { static: false })
  announcement: AnnouncementComponent;

  protected userEmitter$: Subscription;
  protected routerEvent$: Subscription;

  constructor(
    protected service: OnboardingWrapperService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) protected platformId: Object,
    protected router: Router,
    protected location: Location
  ) {}

  async ngOnInit() {
    await this.setShouldShow(this.session.getLoggedInUser());

    this.userEmitter$ = this.session.userEmitter.subscribe(user => {
      this.setShouldShow(user);
    });

    this.routerEvent$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShouldShow(this.session.getLoggedInUser());
      });
  }

  ngOnDestroy(): void {
    if (this.userEmitter$) {
      this.userEmitter$.unsubscribe();
    }

    if (this.routerEvent$) {
      this.routerEvent$.unsubscribe();
    }
  }

  show() {
    this.announcement.hidden = false;
    this.detectChanges();
  }

  /**
   * Re-calculates the visibility of the banner
   * @param {Object} user
   */
  async setShouldShow(user) {
    if (!user) {
      return;
    }

    await this.service.checkProgress();

    this.shouldShow =
      !(this.location.path().indexOf('/onboarding') === 0) &&
      this.service.completedPercentage !== 100 &&
      user;

    this.detectChanges();
  }

  openOnboarding(): void {
    this.service.open();
    this.shouldShow = false;
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
