import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { ChannelAdminConfirmationComponent } from './admin-confirmation.component';
import {
  CompletedPayload,
  ConfirmationAction,
  SubscriptionTimespan,
  SubscriptionType,
} from './admin-confirmation.type';
import { ModalService } from '../../../../../services/ux/modal.service';

/**
 * Opens admin confirmation box for enabling and disabling plus and pro manually
 */
@Injectable({ providedIn: 'root' })
export class ChannelAdminConfirmationService extends AbstractSubscriberComponent {
  // fires on complete
  public readonly completed$: BehaviorSubject<
    CompletedPayload
  > = new BehaviorSubject<CompletedPayload>(null);

  constructor(
    private modalService: ModalService,
    private api: ApiService,
    private toast: FormToastService
  ) {
    super();
  }

  /**
   * Enable or disable pro / plus.
   * @param { SubscriptionType } type - subscription type, plus or pro.
   * @param { ConfirmationAction } action - remove or make.
   * @param { string } userGuid - user guid to act upon.
   */
  public async toggle(
    type: SubscriptionType,
    action: ConfirmationAction,
    userGuid: string
  ): Promise<void> {
    const modal = this.modalService.present(ChannelAdminConfirmationComponent, {
      data: {
        action,
        onComplete: (timespan: SubscriptionTimespan) => {
          this.call(type, action, userGuid, timespan);
          modal.close(timespan);
        },
      },
    });
  }

  /**
   * Call server
   * @param { SubscriptionType } type - subscription type, plus or pro.
   * @param { ConfirmationAction } action - remove or make.
   * @param { SubscriptionTimespan } - timespan of subscription for make calls.
   * @param { string } userGuid - user guid to act upon.
   */
  private call(
    type: SubscriptionType,
    action: ConfirmationAction,
    userGuid: string,
    timespan: SubscriptionTimespan = ''
  ): void {
    this.subscriptions.push(
      this.api
        .put(`api/v2/admin/${type}/${userGuid}/${action}/${timespan}`)
        .pipe(
          take(1),
          catchError(e => {
            this.toast.error('An error has occurred');
            console.error(e);
            return EMPTY;
          })
        )
        .subscribe(val => {
          this.toast.success(`Success`);
          this.completed$.next({
            action: action,
            type: type,
          });
        })
    );
  }
}
