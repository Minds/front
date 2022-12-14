import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DEFAULT_DAILY_TOKEN_BUDGET,
  DEFAULT_TOKEN_DURATION,
  DEFAULT_DAILY_CASH_BUDGET,
  DEFAULT_CASH_DURATION,
} from '../../boost-modal-v2.constants';
import { BoostConfig, BoostPaymentCategory } from '../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';

@Component({
  selector: 'm-boostModalV2__budgetSelector',
  templateUrl: './budget.component.html',
  styleUrls: ['budget.component.ng.scss'],
})
export class BoostModalV2BudgetSelectorComponent {
  // enums.
  public BoostPaymentCategory: typeof BoostPaymentCategory = BoostPaymentCategory;

  // currently selected payment category.
  public readonly paymentCategory$: BehaviorSubject<BoostPaymentCategory> = this
    .service.paymentCategory$;

  // config from service.
  public readonly config: BoostConfig = this.service.getConfig();

  // initial amount of daily tokens - if not already set in service, use default.
  public readonly initialDailyTokenBudget$: Observable<
    number
  > = this.service.dailyBudget$.pipe(
    map((dailyBudget: number) => dailyBudget ?? DEFAULT_DAILY_TOKEN_BUDGET)
  );

  // initial amount of daily cash - if not already set in service, use default.
  public readonly initialDailyCashBudget$: Observable<
    number
  > = this.service.dailyBudget$.pipe(
    map((dailyBudget: number) => dailyBudget ?? DEFAULT_DAILY_CASH_BUDGET)
  );

  // initial duration from tokens - if not already set in service, use default.
  public readonly initialTokenDuration$: Observable<
    number
  > = this.service.duration$.pipe(
    map((duration: number) => duration ?? DEFAULT_TOKEN_DURATION)
  );

  // initial duration from cash - if not already set in service, use default.
  public readonly initialCashDuration$: Observable<
    number
  > = this.service.duration$.pipe(
    map((duration: number) => duration ?? DEFAULT_CASH_DURATION)
  );

  constructor(private service: BoostModalV2Service) {}
}
