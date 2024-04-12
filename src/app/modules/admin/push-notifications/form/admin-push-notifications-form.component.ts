import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Client } from '../../../../services/api/client';
import { ApiResponse } from '../../../../common/api/api.service';
import { AdminPushNotificationsService } from '../admin-push-notifications.service';
import { NotificationDetails } from '../admin-push-notifications.component';

@Component({
  selector: 'm-admin__pushNotifications--form',
  styleUrls: ['admin-push-notifications-form.component.ng.scss'],
  templateUrl: './admin-push-notifications-form.component.html',
})
export class AdminPushNotificationsFormComponent {
  public pushNotificationsForm: UntypedFormGroup = this.formBuilder.group({
    notificationTitle: [
      '',
      {
        initialValueIsDefault: true,
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
        ],
      },
    ],
    notificationMessage: ['', [Validators.maxLength(150)]],
    notificationLink: [''],
    notificationTarget: [
      'all-devices',
      {
        initialValueIsDefault: true,
      },
    ],
  });

  public inProgress: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiClient: Client,
    private adminPushNotificationsService: AdminPushNotificationsService
  ) {}

  sendPushNotification(e: Event) {
    e.preventDefault();
    this.inProgress = true;

    let request = this.prepareRequest();

    let notification: NotificationDetails = {
      title: this.pushNotificationsForm.value.notificationTitle,
      message: this.pushNotificationsForm.value.notificationMessage,
      link: this.pushNotificationsForm.value.notificationLink,
      timestamp: Date.now(),
      counter: null,
      successful_counter: null,
      failed_counter: null,
      skipped_counter: null,
      target: 'all-devices',
      status: 'Pending',
    };

    request
      .then((response: ApiResponse) => {
        this.inProgress = false;

        this.adminPushNotificationsService.sendNotification(notification);

        this.resetFormFields();
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  private prepareRequest(): Promise<ApiResponse> {
    let data = this.pushNotificationsForm.value;
    return this.apiClient.post(
      'api/v3/notifications/push/system',
      data
    ) as Promise<ApiResponse>;
  }

  private resetFormFields(): void {
    this.pushNotificationsForm.reset();
  }
}
