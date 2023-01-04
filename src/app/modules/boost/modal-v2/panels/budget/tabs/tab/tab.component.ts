import { formatNumber } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BoostPaymentCategory,
  EstimatedReach,
} from '../../../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../../../services/boost-modal-v2.service';

@Component({
  selector: 'm-boostModalV2__budgetTab',
  templateUrl: './tab.component.html',
  styleUrls: ['tab.component.ng.scss'],
})
export class BoostModalV2BudgetTabComponent implements OnInit, OnDestroy {
  // enums.
  public BoostPaymentCategory: typeof BoostPaymentCategory = BoostPaymentCategory;

  // category for payments.
  @Input() public paymentCategory: BoostPaymentCategory =
    BoostPaymentCategory.CASH;

  // minimum daily budget selectable via slider.
  @Input() public minDailyBudget: number = 2;

  // maximum daily budget selectable via slider.
  @Input() public maxDailyBudget: number = 5000;

  // minimum duration selectable via slider.
  @Input() public minDuration: number = 1;

  // maximum duration selectable via slider.
  @Input() public maxDuration: number = 30;

  // initial value for daily budget slider.
  @Input() public initialDailyBudget: number = 5;

  // initial value for duration slider.
  @Input() public initialDuration: number = 1;

  // form group.
  public form: FormGroup;

  // text for estimated reach.
  public readonly estimatedReachText$: Observable<
    string
  > = this.service.estimatedReach$.pipe(
    map((estimatedReach: EstimatedReach): string => {
      return estimatedReach
        ? formatNumber(estimatedReach.views.low, this.locale) +
            ` - ` +
            formatNumber(estimatedReach.views.high, this.locale)
        : 'Unknown';
    })
  );

  // subscriptions
  private dailyBudgetValueSubscription: Subscription;
  private durationValueSubscription: Subscription;

  constructor(
    private service: BoostModalV2Service,
    private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    // init formgroup
    this.form = this.formBuilder.group({
      dailyBudget: [this.initialDailyBudget, Validators.required],
      duration: [this.initialDuration, Validators.required],
    });

    // set values in service based on initial values.
    this.service.dailyBudget$.next(this.initialDailyBudget);
    this.service.duration$.next(this.initialDuration);

    // update service on value change.
    this.dailyBudgetValueSubscription = this.form.controls.dailyBudget.valueChanges.subscribe(
      (value: number) => {
        this.service.dailyBudget$.next(value);
      }
    );
    this.durationValueSubscription = this.form.controls.duration.valueChanges.subscribe(
      (value: number) => {
        this.service.duration$.next(value);
      }
    );
  }

  ngOnDestroy(): void {
    this.dailyBudgetValueSubscription?.unsubscribe();
    this.durationValueSubscription?.unsubscribe();
  }

  /**
   * The daily budget steps to use
   * @returns { number[] }
   */
  get dailyBudgetSteps(): number[] {
    return this.paymentCategory === BoostPaymentCategory.CASH
      ? this.service.getConfig().bid_increments.cash
      : this.service.getConfig().bid_increments.offchain_tokens;
  }

  /**
   * Duration text, pluralized.
   * @returns { string } duration text.
   */
  get durationText(): string {
    const val = this.form.controls.duration.value;
    return val > 1 ? `${val} days` : `${val} day`;
  }

  /**
   * Amount text, varied based on currency and pluralized where necessary.
   * @returns { string } amount text.
   */
  get amountText(): string {
    const amount =
      this.form.controls.dailyBudget.value * this.form.controls.duration.value;
    return this.paymentCategory === BoostPaymentCategory.CASH
      ? `\$${amount}`
      : `${amount} tokens`;
  }

  /**
   * Label for minimum daily budget.
   * @returns { string } label for minimum daily budget.
   */
  get minDailyBudgetLabel(): string {
    return this.paymentCategory === BoostPaymentCategory.CASH
      ? `\$${this.minDailyBudget}`
      : `${this.minDailyBudget}`;
  }

  /**
   * Label for maximum daily budget.
   * @returns { string } label for maximum daily budget.
   */
  get maxDailyBudgetLabel(): string {
    return this.paymentCategory === BoostPaymentCategory.CASH
      ? `\$${this.maxDailyBudget}`
      : `${this.maxDailyBudget}`;
  }

  /**
   * A callback function that will renderthe label of the slider
   */
  currentDailyBudgetFormat = (val: number) => {
    return this.paymentCategory === BoostPaymentCategory.CASH
      ? `\$${val}`
      : `${val}`;
  };

  /**
   * A callback function that will renderthe label of the slider
   */
  currentDurationFormat = (val: number) => {
    return `${val} day` + (val > 1 ? 's' : '');
  };
}
