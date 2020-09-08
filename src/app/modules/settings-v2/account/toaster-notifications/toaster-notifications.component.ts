import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Observable, Subscription } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

import { SettingsV2Service } from '../../settings-v2.service';
import { SwPush } from '@angular/service-worker';
import { Client } from '../../../../services/api';

@Component({
  selector: 'm-settingsV2__toasterNotifications',
  templateUrl: './toaster-notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2ToasterNotificationsComponent
  implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  init: boolean = false;
  inProgress: boolean = false;
  user: MindsUser;
  settingsSubscription: Subscription;
  form;

  readonly VAPID_PUBLIC_KEY =
    'BLBx-hf2WrL2qEa0qKb-aCJbcxEvyn62GDTyyP9KTS5K7ZL0K7TfmOKSPqp8vQF0DaG8hpSBknz_x3qf5F4iEFo';

  constructor(
    private swPush: SwPush,
    protected cd: ChangeDetectorRef,
    private session: Session,
    private client: Client,
    protected settingsService: SettingsV2Service,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.form = new FormGroup({
      toasterNotifications: new FormControl(''),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        this.toasterNotifications.setValue(settings.toaster_notifications);
        this.detectChanges();
      }
    );

    this.init = true;
    this.detectChanges();
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then(sub => this.client.post('api/v2/push', { sub }))
      .catch(err => console.error('Could not subscribe to notifications', err));
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      const formValue = {
        toaster_notifications: this.toasterNotifications.value,
      };

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        formValue
      );
      if (response.status === 'success') {
        this.formSubmitted.emit({ formSubmitted: true });
        this.form.markAsPristine();
      }
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canSubmit(): boolean {
    return this.form.valid && !this.inProgress && !this.form.pristine;
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

  get toasterNotifications() {
    return this.form.get('toasterNotifications');
  }
}
