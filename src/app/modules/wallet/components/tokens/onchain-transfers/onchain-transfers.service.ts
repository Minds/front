import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../../common/api/api.service';
import { ToasterService } from '../../../../../common/services/toaster.service';

/**
 * Handles the getting of a users withdrawals summary from the server.
 */
@Injectable({ providedIn: 'root' })
export class WalletOnchainTransfersSummaryService {
  constructor(
    private api: ApiService,
    private toast: ToasterService
  ) {}

  /**
   * Gets withdrawals from server.
   * @param { string } offset - paging token - defaults to empty string.
   * @returns { Observable<ApiResponse> } - api response
   */
  public getWithdrawals$(offset: string = ''): Observable<ApiResponse> {
    return this.api.get('api/v3/rewards/withdrawals', { offset: offset }).pipe(
      take(1),
      catchError((e) => this.handleError(e))
    );
  }

  /**
   * Handle error
   * @param e - error
   * @returns { Observable<null> } empty observable
   */
  private handleError(e): Observable<null> {
    console.error(e);
    this.toast.error(e.message ?? 'An unknown error has occurred');
    return EMPTY;
  }
}
