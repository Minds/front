import { Component, OnDestroy, OnInit } from '@angular/core';
import { Boost, BoostState, RejectionReason } from '../../../boost.types';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { BoostConsoleService } from '../../services/console.service';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ApiResponse } from '../../../../../common/api/api.service';
import { ToasterService } from '../../../../../common/services/toaster.service';

/**
 * Verify uniqueness modal root level component.
 */
@Component({
  selector: 'm-boost_rejection_modal',
  templateUrl: './boost-rejection-modal.component.html',
  styleUrls: ['boost-rejection-modal.component.ng.scss'],
})
export class BoostRejectionModalComponent implements OnInit, OnDestroy {
  public boost: Boost;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private mindsConfig: ConfigsService,
    private boostConsoleService: BoostConsoleService,
    private toaster: ToasterService
  ) {}

  public rejectionReasons: RejectionReason[] = [];

  get saving(): BehaviorSubject<boolean> {
    return this.boostConsoleService.inProgress$$;
  }

  public selectReason(reason: RejectionReason) {
    this.boost.rejection_reason = reason.code;
  }
  ngOnInit(): void {
    this.boost.rejection_reason = null;

    this.rejectionReasons = this.mindsConfig.get('boost')[
      'rejection_reasons'
    ] as RejectionReason[];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};
  public onRejectIntent(): void {
    this.subscriptions.push(
      this.boostConsoleService
        .reject(this.boost)
        .pipe(
          catchError(e => {
            console.error(e);
            this.toaster.error(e.error.message);
            return of(null);
          }),
          tap((response: ApiResponse) => {
            this.boost.boost_status = BoostState.REJECTED;
            this.boostConsoleService.decrementAdminStatCounter();
            this.toaster.success('Boost successfully rejected');
            this.onDismissIntent();
          }),
          finalize(() => {
            this.boostConsoleService.inProgress$$.next(false);
            return of(null);
          })
        )
        .subscribe()
    );
  }

  setModalData({ onCloseIntent, boost }) {
    this.onDismissIntent = onCloseIntent || (() => {});
    this.boost = boost;
  }
}
