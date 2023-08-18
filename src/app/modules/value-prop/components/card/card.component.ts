import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ValuePropService } from '../../services/value-prop.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PresentableValuePropCard } from '../../value-prop.types';

@Component({
  selector: 'm-valueProp__card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.ng.scss'],
})
export class ValuePropCardComponent implements OnInit, OnDestroy {
  /**
   * Which card do we want to show
   */
  @Input() index: number;

  /**
   * This card
   */
  protected card$: BehaviorSubject<
    PresentableValuePropCard
  > = new BehaviorSubject<PresentableValuePropCard>(null);

  private subscriptions: Subscription[] = [];

  constructor(protected service: ValuePropService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.valuePropCards$.subscribe(cards => {
        this.card$.next(cards[this.index]);
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
