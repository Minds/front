import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { EmailConfirmationService } from './email-confirmation.service';
import { Session } from '../../../services/session';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ConfigsService } from '../../services/configs.service';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

/**
 * Component that displays an announcement-like banner
 * asking the user to confirm their email address and a link
 * to re-send the confirmation email.
 * @see AnnouncementComponent
 */
@Component({
  providers: [EmailConfirmationService],
  selector: 'm-emailConfirmation',
  templateUrl: 'email-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {
  readonly fromEmailConfirmation: number;
  sent: boolean = false;
  shouldShow: boolean = false;
  canClose: boolean = false;

  protected userEmitter$: Subscription;
  protected routerEvent$: Subscription;
  protected canCloseTimer: number;

  constructor(
    protected service: EmailConfirmationService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) protected platformId: Object,
    configs: ConfigsService,
    protected router: Router,
    protected location: Location
  ) {
    this.fromEmailConfirmation = configs.get('from_email_confirmation');
  }

  ngOnInit(): void {
    this.setShouldShow(this.session.getLoggedInUser());

    this.userEmitter$ = this.session.userEmitter.subscribe(user => {
      this.sent = false;
      this.setShouldShow(user);
      this.detectChanges();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.canCloseTimer = window.setTimeout(() => {
        this.canClose = true;
        this.detectChanges();
      }, 3000);
    }

    this.routerEvent$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setShouldShow(this.session.getLoggedInUser());
        this.detectChanges();
      });
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.canCloseTimer);

    if (this.userEmitter$) {
      this.userEmitter$.unsubscribe();
    }

    if (this.routerEvent$) {
      this.routerEvent$.unsubscribe();
    }
  }

  /**
   * Re-calculates the visibility of the banner
   * @param {Object} user
   */
  setShouldShow(user): void {
    this.shouldShow =
      !(this.location.path().indexOf('/onboarding') === 0) &&
      !this.fromEmailConfirmation &&
      user &&
      user.email_confirmed === false;
  }

  /**
   * Uses the service to re-send the confirmation email
   */
  async send(): Promise<void> {
    this.sent = true;
    this.detectChanges();

    try {
      const sent = await this.service.send();

      if (!sent) {
        this.sent = false;
      }
    } catch (e) {}

    this.detectChanges();
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
