import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService, ApiResponse } from '../../../common/api/api.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PaywallService {
  constructor(private api: ApiService) {}

  /**
   * Unlock a post
   * @param guid
   */
  unlock(guid: string): Observable<ApiResponse> {
    return this.api
      .get(`api/v1/wire/threshold/${guid}`)
      .pipe(map((response: ApiResponse) => response.entity));
  }
}
