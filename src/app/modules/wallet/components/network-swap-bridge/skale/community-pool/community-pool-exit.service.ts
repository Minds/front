import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiService } from '../../../../../../common/api/api.service';
import { FormToastService } from '../../../../../../common/services/form-toast.service';

/**
 * Service for checking whether a user CAN exit from the SKALE chain
 * based on their CommunityPool balance.
 */
@Injectable({ providedIn: 'root' })
export class SkaleCommunityPoolExitService {
  constructor(private api: ApiService, private toast: FormToastService) {}

  /**
   * Determine whether an address can exit from the SKALE chain based on their
   * CommunityPool balance.
   * @param { string } address - address we are checking for.
   * @returns { Observable<boolean | void> } - observable of http response or void.
   */
  public canExit(address: string): Observable<boolean | void> {
    return this.api
      .get('api/v3/blockchain/skale/canExit', {
        address: address,
      })
      .pipe(
        take(1),
        map(response => {
          return response['canExit'];
        }),
        catchError(e => {
          console.error(e);
          this.toast.error(
            'An error has occurred checking whether you can exit the SKALE chain'
          );
          return of(false);
        })
      );
  }
}
