import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import { BoostConsoleAdminStatsResponse } from '../../boost.types';

/**
 * Service that handles the getting of boost stats for admins.
 */
@Injectable({ providedIn: 'root' })
export class BoostConsoleAdminStatsService {
  // count of pending safe boosts.
  public readonly pendingSafeCount$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  // count of pending controversial boosts.
  public readonly pendingControversialCount$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  constructor(private api: ApiService) {}

  /**
   * Fetch admin stats from server and set the values into local state.
   * @returns { Promise<void> }
   */
  public async fetch(): Promise<void> {
    try {
      let response: BoostConsoleAdminStatsResponse = await this.api
        .get<BoostConsoleAdminStatsResponse>('api/v3/boosts/admin/stats')
        .toPromise();

      this.pendingSafeCount$.next(response?.global_pending?.safe_count ?? 0);
      this.pendingControversialCount$.next(
        response?.global_pending?.controversial_count ?? 0
      );
    } catch (e) {
      console.error(e);
      this.pendingSafeCount$.next(0);
      this.pendingControversialCount$.next(0);
    }
  }

  /**
   * Decrement the pending safe count.
   * @returns { void }
   */
  public decrementPendingSafeCount(): void {
    const currentCount: number = this.pendingSafeCount$.getValue();
    this.pendingSafeCount$.next(currentCount - 1);
  }

  /**
   * Decrement the pending controversial count.
   * @returns { void }
   */
  public decrementPendingControversialCount(): void {
    const currentCount: number = this.pendingControversialCount$.getValue();
    this.pendingControversialCount$.next(currentCount - 1);
  }
}
