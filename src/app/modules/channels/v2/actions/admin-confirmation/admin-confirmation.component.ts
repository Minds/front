import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import {
  ConfirmationAction,
  SubscriptionTimespan,
} from './admin-confirmation.type';

/**
 * Modal to confirm that an admin wishes to manually add/remove plus/pro.
 * (i.e. via the <m-channelActions__menu>)
 */
@Component({
  selector: 'm-channel__adminConfirmation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'admin-confirmation.component.html',
  styleUrls: ['admin-confirmation.component.ng.scss'],
})
export class ChannelAdminConfirmationComponent extends AbstractSubscriberComponent {
  // holds period we we are permitting.
  public readonly period$ = new BehaviorSubject<SubscriptionTimespan>('month');

  // action
  public action$: BehaviorSubject<ConfirmationAction> = new BehaviorSubject<
    ConfirmationAction
  >(null);

  /**
   * Completion intent.
   */
  onComplete: (tier: SubscriptionTimespan) => any = () => {};

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  constructor() {
    super();
  }

  /**
   * Opts to pass into component.
   */
  setModalData({ action, onComplete, onDismissIntent }) {
    this.action$.next(action ?? '');
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Called on select option change.
   * @param { SubscriptionTimespan } - value of select option.
   * @returns { void }
   */
  public onSelectChange(value: SubscriptionTimespan): void {
    this.period$.next(value);
  }

  /**
   * Called on confirm button click.
   * @returns { void }
   */
  public confirmClick(): void {
    this.subscriptions.push(
      combineLatest([this.action$, this.period$])
        .pipe(
          take(1),
          map(([action, period]) => {
            this.onComplete(action === 'make' ? period : '');
          })
        )
        .subscribe()
    );
  }
}
