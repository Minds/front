import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, scan, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { GetPaymentsRequest, Payment } from './payment-history.types';

/**
 * Service for retrieving payment history.
 */
@Injectable()
export class SettingsV2PaymentHistoryService {
  // whether there is more data to be requested.
  public readonly hasMore$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  // whether request is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  // current paging token.
  private readonly pagingToken$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  // paging token to be used next.
  private readonly nextPagingToken$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  // raw list of payments, requests from server.
  public rawList$: Observable<Payment[]> = this.pagingToken$.pipe(
    // set in progress state
    tap((_) => this.inProgress$.next(true)),
    // switch stream to be an api request to get payments using the paging token.
    switchMap((pagingToken) => {
      return this.api.get<GetPaymentsRequest>('api/v3/payments', {
        offset: pagingToken,
      });
    }),
    // set whether there are more payments and the next paging token.
    tap((response: GetPaymentsRequest) => {
      this.hasMore$.next(response['has_more'] ?? false);
      if (response.data.length) {
        this.nextPagingToken$.next(
          response['data'][response['data'].length - 1]['payment_id'] ?? null
        );
      }
    }),
    // map output to the response data.
    map((response: GetPaymentsRequest) => response.data || []),
    // set progress state to false.
    tap((_) => this.inProgress$.next(false)),
    // combine with previous calls result for pagination.
    scan((acc: Payment[], value: Payment[]) => [...acc, ...value], []),
    // handle any error.
    catchError((e) => {
      console.error(e);
      this.toasterService.error(
        e?.error?.message ?? 'An unknown error has occurred'
      );
      return EMPTY;
    })
  );

  constructor(
    private api: ApiService,
    private toasterService: ToasterService
  ) {}

  /**
   * Load next from API by setting paging token to the next paging token.
   * @returns { void }
   */
  public loadNext(): void {
    if (this.inProgress$.getValue()) {
      return;
    }
    this.pagingToken$.next(this.nextPagingToken$.getValue());
  }
}
