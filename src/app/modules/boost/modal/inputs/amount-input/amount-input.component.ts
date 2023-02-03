import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, combineLatest, fromEvent, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BoostImpressionRates, BoostTab } from '../../boost-modal.types';
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
export class BoostModalAmountInputComponent
  implements OnDestroy, AfterViewInit {
  // general subscriptions
  private subscriptions: Subscription[] = [];

  // amount input subscriptions.
  private amountInputSubscriptions: Subscription[] = [];

  // max impressions.
  public maxImpressions = MAXIMUM_SINGLE_BOOST_IMPRESSIONS;

  // min impressions.
  public minImpressions = MINIMUM_SINGLE_BOOST_IMPRESSIONS;

  // true if input is focused.
  public readonly isFocused$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Gets impressions subject from service.
  public impressions$: BehaviorSubject<number> = this.service.impressions$;

  // Gets impressions subject from service.
  public currencyAmount$: BehaviorSubject<number> = this.service
    .currencyAmount$;

  // Gets rate from service.
  public impressionRates$: BehaviorSubject<BoostImpressionRates> = this.service
    .impressionRates$;

  // Gets current boost tab from service.
  public activeTab$: BehaviorSubject<BoostTab> = this.service.activeTab$;

  // amount input form
  public form: UntypedFormGroup;

  // impressions input ElementRef
  @ViewChild('impressionsInput') impressionsInput: ElementRef;

  // tokens input ElementRef
  @ViewChild('currencyAmountInput') currencyAmountInput: ElementRef;

  // currency amount label ElementRef
  @ViewChild('currencyAmountLabel') currencyAmountLabel: ElementRef;

  // impressions label ElementRef
  @ViewChild('impressionsLabel') impressionsLabel: ElementRef;

  constructor(private service: BoostModalService) {}

  ngOnInit(): void {
    // subscribe to changes in current rate and setup form controls accordingly.
    this.subscriptions.push(
      combineLatest([this.impressionRates$, this.activeTab$])
        .pipe(
          map(
            ([impressionRates, activeTab]: [
              BoostImpressionRates,
              BoostTab
            ]) => {
              this.setupFormControls();
            }
          )
        )
        .subscribe()
    );
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.activeTab$.subscribe(() => {
        this.resetSubscriptions();
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of [
      ...this.subscriptions,
      ...this.amountInputSubscriptions,
    ]) {
      subscription.unsubscribe();
    }
  }

  /**
   * Reset input subscriptions and resubscribe.
   * @returns { void }
   */
  private resetSubscriptions(): void {
    // unsub from any existing to avoid subscription duplication.
    for (let subscription of this.amountInputSubscriptions) {
      subscription.unsubscribe();
    }

    this.amountInputSubscriptions.push(
      fromEvent(this.currencyAmountInput.nativeElement, 'focus').subscribe(
        value => {
          this.isFocused$.next(true);
        }
      ),
      fromEvent(this.currencyAmountInput.nativeElement, 'focusout').subscribe(
        value => {
          this.isFocused$.next(false);
        }
      ),
      fromEvent(this.currencyAmountLabel.nativeElement, 'click').subscribe(
        value => {
          this.currencyAmountInput.nativeElement.focus();
        }
      ),
      fromEvent(this.impressionsInput.nativeElement, 'focus').subscribe(
        value => {
          this.isFocused$.next(true);
        }
      ),
      fromEvent(this.impressionsInput.nativeElement, 'focusout').subscribe(
        value => {
          this.isFocused$.next(false);
        }
      ),
      fromEvent(this.impressionsLabel.nativeElement, 'click').subscribe(
        value => {
          this.impressionsInput.nativeElement.focus();
        }
      ),
      this.form.controls.currencyAmount.valueChanges.subscribe(
        (value: number): void => {
          this.currencyAmountValueChanged(value);
        }
      ),
      this.form.controls.impressions.valueChanges.subscribe(
        (value: number): void => {
          this.viewsValueChanged(value);
        }
      )
    );
  }

  /**
   * On views value changed, update currency amount to match based on rate.
   * @param { number } $event - views value.
   * @returns { void }
   */
  private viewsValueChanged($event: number): void {
    this.impressions$.next($event);
    const currencyAmount: number = parseFloat(
      ($event / this.getImpressionRate()).toFixed(2)
    );
    const currentCurrencyAmount: number = this.form.controls.currencyAmount
      .value;

    // stop recursive loop if value matches, and don't process events for less than the min impressions.
    if (
      currentCurrencyAmount !== currencyAmount &&
      $event >= MINIMUM_SINGLE_BOOST_IMPRESSIONS
    ) {
      this.currencyAmount$.next(currencyAmount);
      this.form.controls.currencyAmount.setValue(currencyAmount);
    }
  }

  /**
   * On currency amount value changed, update impressions to match based on rate.
   * @param { number } $event - currency amount value.
   * @returns { void }
   */
  private currencyAmountValueChanged($event: number): void {
    this.currencyAmount$.next($event);
    const impressions: number = Math.floor($event * this.getImpressionRate());
    const currentImpressions: number = this.form.controls.impressions.value;

    // stop recursive loop if value matches, and don't process events for less than the min amount.
    if (currentImpressions !== impressions && $event >= 0.01) {
      this.impressions$.next(impressions);
      this.form.controls.impressions.setValue(impressions);
    }
  }

  /**
   * Sets up form controls depending on the active tab.
   * @param { number } rate - rate.
   * @returns { void }
   */
  private setupFormControls(): void {
    const rate = this.getImpressionRate();
    const defaultViews = this.maxImpressions / 2;
    const defaultCurrencyAmount = parseFloat((defaultViews / rate).toFixed(2));
    const minCurrencyAmount = this.minImpressions / rate;
    const maxCurrencyAmount = this.maxImpressions / rate;

    this.form = new UntypedFormGroup({
      currencyAmount: new UntypedFormControl(defaultCurrencyAmount, {
        validators: [
          Validators.required,
          Validators.max(maxCurrencyAmount),
          Validators.min(minCurrencyAmount),
        ],
      }),
      impressions: new UntypedFormControl(defaultViews, {
        validators: [
          Validators.required,
          Validators.max(this.maxImpressions),
          Validators.min(this.minImpressions),
        ],
      }),
    });

    this.currencyAmountValueChanged(defaultCurrencyAmount);
  }

  /**
   * Get impression rate for currently active tab.
   * @returns { number } impression rate for currently active tab.
   */
  private getImpressionRate(): number {
    const activeTab = this.activeTab$.getValue();
    const impressionRates = this.impressionRates$.getValue();

    if (activeTab === 'cash') {
      return impressionRates.cash;
    } else {
      return impressionRates.tokens;
    }
  }
}
