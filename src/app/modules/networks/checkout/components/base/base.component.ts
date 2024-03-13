import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CheckoutPageKeyEnum,
  CheckoutTimePeriodEnum,
} from '../../../../../../graphql/generated.engine';
import { TopbarAlertService } from '../../../../../common/components/topbar-alert/topbar-alert.service';
import { Observable } from 'rxjs';
import { NetworksCheckoutService } from '../../services/checkout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { PlanCardPriceTimePeriodEnum } from '../../../../../common/components/plan-card/plan-card.component';

/** Query params for checkout page. */
export type CheckoutPageQueryParams = {
  planId: string;
  timePeriod?: string;
  trialUpgradeRequest?: boolean;
};

/**
 * Base component for networks checkout.
 */
@Component({
  selector: 'm-networksCheckout__base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.ng.scss'],
  providers: [NetworksCheckoutService],
})
export class NetworksCheckoutBaseComponent implements OnInit, OnDestroy {
  /** Enum for use in template. */
  public readonly PlanCardPriceTimePeriodEnum: typeof PlanCardPriceTimePeriodEnum = PlanCardPriceTimePeriodEnum;

  /** Whether the site has its topbar alert shown. Used to position sticky sidebar. */
  public readonly topbarAlertShown$: Observable<boolean> = this
    .topbarAlertService.shouldShow$;

  /** Whether the checkout data is loaded. */
  public readonly loaded$: Observable<boolean> = this.checkoutService.loaded$;

  constructor(
    private checkoutService: NetworksCheckoutService,
    private topbarAlertService: TopbarAlertService,
    private toaster: ToasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const planId: string = this.route.snapshot.queryParamMap.get('planId');
    const trialUpgradeRequest: boolean =
      this.route.snapshot.queryParamMap.get('trialUpgradeRequest') === 'true';
    let timePeriod: CheckoutTimePeriodEnum = CheckoutTimePeriodEnum.Monthly;
    let page: CheckoutPageKeyEnum = CheckoutPageKeyEnum.Addons;

    if (this.route.snapshot.queryParamMap.get('timePeriod') === 'yearly') {
      timePeriod = CheckoutTimePeriodEnum.Yearly;
    }

    const showConfirmationPage: boolean =
      this.route.snapshot.queryParamMap.get('confirmed') === 'true';
    if (showConfirmationPage) {
      page = CheckoutPageKeyEnum.Confirmation;
    }

    if (!planId && !showConfirmationPage) {
      this.toaster.warn('Please select a plan.');
      this.router.navigateByUrl('/about/networks');
      return;
    }

    this.checkoutService.setIsTrialUpgradeRequest(trialUpgradeRequest).init({
      planId: planId ?? '',
      page: page,
      timePeriod: timePeriod,
    });
  }

  ngOnDestroy(): void {
    this.checkoutService.setIsTrialUpgradeRequest(false);
  }
}
