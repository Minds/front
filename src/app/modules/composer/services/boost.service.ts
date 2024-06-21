import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoostModalV2LazyService } from '../../boost/modal-v2/boost-modal-v2-lazy.service';
import { BoostableEntity } from '../../boost/modal-v2/boost-modal-v2.types';

/**
 * Composer Boost service. Handles tracking of whether the composer is
 * in Boost mode and the opening of the Boost modal.
 */
@Injectable({ providedIn: 'root' })
export class ComposerBoostService {
  /** Whether composer is in Boost mode. */
  public readonly isBoostMode$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private boostModal: BoostModalV2LazyService) {}

  /**
   * Reset Boost mode.
   * @returns { void }
   */
  public reset(): void {
    this.isBoostMode$.next(false);
  }

  /**
   * Open the Boost modal.
   * @param { BoostableEntity } activity - The activity to boost.
   * @returns { void }
   */
  public openBoostModal(activity: BoostableEntity): void {
    this.boostModal.open(activity);
  }
}
