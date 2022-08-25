import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../common/api/api.service';

/**
 * Service to check whether an address is restricted.
 */
@Injectable({ providedIn: 'root' })
export class RestrictedAddressService {
  constructor(private api: ApiService) {}

  /**
   * Check an address.
   * @param { string } address - address to check.
   * @returns { Observable<boolean> }
   */
  public check(address: string): Observable<boolean> {
    return this.api.get(`api/v3/rewards/check/${address}`).pipe(
      take(1),
      map((response: ApiResponse) => {
        return response?.status === 'success';
      }),
      catchError(e => {
        console.error(e);
        return of(false);
      })
    );
  }
}
