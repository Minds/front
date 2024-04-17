import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SettingsV2PaymentHistoryService } from './payment-history.service';
import { Payment } from './payment-history.types';

/**
 * Component for displaying payment history in settings.
 */
@Component({
  selector: 'm-settingsV2__paymentHistory',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.ng.scss'],
  providers: [SettingsV2PaymentHistoryService],
})
export class SettingsV2PaymentHistoryComponent {
  // whether there is more data to be requested.
  public readonly hasMore$: BehaviorSubject<boolean> = this.service.hasMore$;
  // whether request is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> =
    this.service.inProgress$;
  // Observable of list with replay shared amongst subscribers.
  public readonly list$: Observable<Payment[]> =
    this.service.rawList$.pipe(shareReplay());

  constructor(private service: SettingsV2PaymentHistoryService) {}

  /**
   * Call to load next from service.
   * @returns { void }
   */
  public loadNext(): void {
    this.service.loadNext();
  }
}
