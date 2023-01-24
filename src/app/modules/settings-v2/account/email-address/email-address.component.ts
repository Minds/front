import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Observable, Subscription } from 'rxjs';
import { SettingsV2Service } from '../../settings-v2.service';
import { ConfirmPasswordModalComponent } from '../../../modals/confirm-password/modal.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { FeedNoticeService } from '../../../notices/services/feed-notice.service';

/**
 * Settings form for changing the email address where notifications are sent.
 */
@Component({
  selector: 'm-settingsV2__emailAddress',
  templateUrl: './email-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2EmailAddressComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  user;
  settingsSubscription: Subscription;
  form;
  currentEmail: string = '';

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected settingsService: SettingsV2Service,
    private dialogService: DialogService,
    protected modalService: ModalService,
    private feedNotices: FeedNoticeService
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.form = new UntypedFormGroup({
      email: new UntypedFormControl('', {
        validators: [Validators.required, Validators.email],
        // updateOn: 'blur',
      }),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.currentEmail = settings.email;
        this.email.setValue(settings.email);
        this.detectChanges();
      }
    );

    this.init = true;
    this.detectChanges();
  }

  save() {
    if (!this.canSubmit()) {
      return;
    }

    const modal = this.modalService.present(ConfirmPasswordModalComponent, {
      data: {
        onComplete: wire => {
          this.submit();
          modal.close(wire);
        },
      },
    });
  }

  async submit() {
    try {
      this.inProgress = true;
      this.detectChanges();

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        this.form.value
      );
      if (!response || response.status !== 'success') {
        throw response?.message ?? 'An error has occurred';
      }
      this.formSubmitted.emit({ formSubmitted: true });
      this.user.email_confirmed = false;

      // reset feed notices so verify email notice shows.
      this.feedNotices.undismiss('verify-email');
      this.feedNotices.fetch();
      this.form.reset();
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.pristine || this.email.value === this.currentEmail) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    const valChanged = this.email.value !== this.currentEmail;
    return !this.inProgress && this.form.valid && valChanged;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  get email() {
    return this.form.get('email');
  }
}
