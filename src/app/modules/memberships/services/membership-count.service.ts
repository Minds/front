import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Service to globally track state of memberships count.
 * Can be used to increment or decrement the count, and to subscribe to
 * changes in the count.
 */
@Injectable({ providedIn: 'root' })
export class MembershipsCountService {
  /** Count of memberships. */
  public readonly count$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  constructor(private configs: ConfigsService) {
    this.count$.next(
      this.configs.get('tenant')?.['total_active_memberships'] ?? 0
    );
  }

  /**
   * Increment the membership count.
   * @returns { void }
   */
  public incrementMembershipCount(): void {
    this.count$.next(this.count$.getValue() + 1);
  }

  /**
   * Decrement the membership count.
   * @returns { void }
   */
  public decrementMembershipCount(): void {
    if (this.count$.getValue() < 1) return;
    this.count$.next(this.count$.getValue() - 1);
  }
}
