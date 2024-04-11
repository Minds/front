import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ValuePropService } from '../../services/value-prop.service';
import { BehaviorSubject, Subscription, filter, take } from 'rxjs';
import { PresentableValuePropCard } from '../../value-prop.types';

/**
 * Outlet for value prop cards - handles the logic behind when to display
 * a card prop card and which card to show when placed in a feed.
 */
@Component({
  selector: 'm-valueProp__cardOutlet',
  template: `
    <m-valueProp__card
      *ngIf="card$ | async as card"
      [title]="card.title"
      [altText]="card.altText"
      [imageUrl]="card.imageUrl"
      [showBorderTop]="showBorderTop"
    ></m-valueProp__card>
  `,
})
export class ValuePropCardOutletComponent implements OnInit, OnDestroy {
  /** Whether top border should be present on the card. */
  @Input() showBorderTop: boolean = false;

  /** Card to be shown (can be null). */
  public card$: BehaviorSubject<PresentableValuePropCard> =
    new BehaviorSubject<PresentableValuePropCard>(null);

  // array of subscriptions.
  private subscriptions: Subscription[] = [];

  constructor(protected service: ValuePropService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.nextUnshownCard$
        .pipe(take(1), filter(Boolean))
        .subscribe((card: PresentableValuePropCard): void => {
          // set card to be shown and mark is as shown.
          this.card$.next(card);
          this.service.setCardAsShown(card);
        })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
