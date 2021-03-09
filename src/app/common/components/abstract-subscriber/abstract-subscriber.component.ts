import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * Extend to use subscription array to store subscriptions,
 * which are then unsubscribed to on component destroy.
 */
export abstract class AbstractSubscriberComponent implements OnDestroy {
  protected subscriptions: Subscription[] = [];

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
