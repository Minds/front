import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Observable, Subscription } from 'rxjs';
import { ConfigsService } from '../../services/configs.service';
import { Location } from '@angular/common';
import { FormToastService } from '../../services/form-toast.service';
import { EmailResendService } from '../../services/email-resend.service';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';

/**
 * Component that displays an announcement-like banner
 * asking the user to confirm their email address and a link
 * to re-send the confirmation email.
 * @see AnnouncementComponent
 */
@Component({
  selector: 'm-emailConfirmation',
  templateUrl: 'email-confirmation.component.html',
  styleUrls: ['email-confirmation.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {
  private readonly fromEmailConfirmation: number;
  public sent: boolean = false;
  public shouldShow: boolean = false;
  public retryTimer$: Observable<number> = this.emailResend.retryTimer$;
  public resendInProgress$: Observable<boolean> = this.emailResend.inProgress$;

  protected userEmitter$: Subscription;

  @HostBinding('class.m-emailConfirmation--activityV2')
  activityV2Feature: boolean;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected location: Location,
    protected toast: FormToastService,
    protected emailResend: EmailResendService,
    private experiments: ExperimentsService,
    configs: ConfigsService
  ) {
    this.fromEmailConfirmation = configs.get('from_email_confirmation');
  }

  ngOnInit(): void {
    this.setShouldShow(this.session.getLoggedInUser());

    // subscribe to user changes
    this.userEmitter$ = this.session.userEmitter.subscribe(user => {
      this.sent = false;
      this.setShouldShow(user);
      this.detectChanges();
    });

    this.activityV2Feature = this.experiments.hasVariation(
      'front-5229-activities',
      true
    );
  }

  ngOnDestroy(): void {
    if (this.userEmitter$) {
      this.userEmitter$.unsubscribe();
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
    this.emailResend.send();
    this.detectChanges();
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
