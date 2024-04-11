import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Provides a bridge for components to see whether the comment poster
 * reports that a comment is in progress.
 */
@Injectable({ providedIn: 'root' })
export class IsCommentingService implements OnDestroy {
  /**
   * Holds true if poster reports that user is actively commenting.
   */
  public readonly isCommenting$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  ngOnDestroy(): void {
    this.reset();
  }

  /**
   * Reset isCommenting to false.
   * @returns { void }
   */
  public reset(): void {
    this.isCommenting$.next(false);
  }
}
