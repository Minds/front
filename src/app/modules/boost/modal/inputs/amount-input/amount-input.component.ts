import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  BoostModalService,
  MAXIMUM_SINGLE_BOOST_IMPRESSIONS,
  MINIMUM_SINGLE_BOOST_IMPRESSIONS,
} from '../../boost-modal.service';

@Component({
  selector: 'm-boostModal__amountInput',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.ng.scss'],
})
export class BoostModalAmountInputComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  /**
   * Value of tokens.
   */
  public readonly tokens$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(2.5);

  // max impressions.
  public maxImpressions = MAXIMUM_SINGLE_BOOST_IMPRESSIONS;

  // min impressions.
  public minImpressions = MINIMUM_SINGLE_BOOST_IMPRESSIONS;

  // amount input form
  public form: FormGroup;

  constructor(
    private service: BoostModalService,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * Gets impressions subject from service.
   * @returns { BehaviorSubject<number> } - impressions.
   */
  get impressions$(): BehaviorSubject<number> {
    return this.service.impressions$;
  }

  /**
   * Gets rate from service.
   * @returns { BehaviorSubject<number> } - rate.
   */
  get rate$(): BehaviorSubject<number> {
    return this.service.rate$;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.rate$.subscribe(rate => {
        const defaultViews = this.maxImpressions / 2;
        const defaultTokens = defaultViews / rate;
        const maxTokens = this.maxImpressions / rate;
        const minTokens = this.minImpressions / rate;

        this.form = new FormGroup({
          tokens: new FormControl(defaultTokens, {
            validators: [
              Validators.required,
              Validators.max(maxTokens),
              Validators.min(minTokens),
            ],
          }),
          impressions: new FormControl(defaultViews, {
            validators: [
              Validators.required,
              Validators.max(this.maxImpressions),
              Validators.min(this.minImpressions),
            ],
          }),
        });
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * On views value changed, update tokens to match based on rate.
   * @param { number } $event - views value.
   * @returns { void }
   */
  public viewsValueChanged($event: number): void {
    this.tokens$.next($event / this.rate$.getValue());
    this.cd.detectChanges();
  }

  /**
   * On tokens value changed, update impressions to match based on rate.
   * @param { number } $event - tokens value.
   * @returns { void }
   */
  public tokensValueChanged($event: number): void {
    this.impressions$.next($event * this.rate$.getValue());
    this.cd.detectChanges();
  }
}
