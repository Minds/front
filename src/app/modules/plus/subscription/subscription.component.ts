import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { PlusService } from '../plus.service';
import { WirePaymentHandlersService } from '../../wire/wire-payment-handlers.service';
import {
  UpgradeOptionCurrency,
  UpgradeOptionInterval,
} from '../../upgrades/upgrade-options.component';
import currency from '../../../helpers/currency';
import { Location } from '@angular/common';
import { ConfigsService } from '../../../common/services/configs.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { WireEventType } from '../../wire/v2/wire-v2.service';
import { FeaturesService } from '../../../services/features.service';
import { WireCreatorComponent } from '../../wire/v2/creator/wire-creator.component';
import * as moment from 'moment';
import { ModalService } from '../../../services/ux/modal.service';

/**
 * Contains an action button for upgrading to plus and
 * information about plus subscription options
 * in different currencies (usd/tokens) and
 * durations (yearly/monthly/lifetime).
 *
 * Includes free trial promotion handling, if applicable.
 *
 * See it on the /plus marketing page
 */
@Component({
  selector: 'm-plus--subscription',
  templateUrl: 'subscription.component.html',
  styleUrls: ['./subscription.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusSubscriptionComponent implements OnInit {
  readonly upgrades; // TODO: add type
  @Output() onEnable: EventEmitter<any> = new EventEmitter();

  @Output() onDisable: EventEmitter<any> = new EventEmitter();

  interval: UpgradeOptionInterval = 'yearly';

  currency: UpgradeOptionCurrency = 'usd';

  paramSubscription: Subscription;

  isLoggedIn: boolean = false;

  inProgress: boolean = false;

  active: boolean;

  hasSubscription: boolean = false;

  expires: number = 0;

  userIsPro: boolean = false;

  criticalError: boolean = false;

  error: string = '';

  constructor(
    protected service: PlusService,
    protected session: Session,
    protected modalService: ModalService,
    protected wirePaymentHandlers: WirePaymentHandlersService,
    protected cd: ChangeDetectorRef,
    protected route: ActivatedRoute,
    protected router: Router,
    configs: ConfigsService,
    protected toasterService: FormToastService,
    private features: FeaturesService
  ) {
    this.upgrades = configs.get('upgrades');

    const user = session.getLoggedInUser();
    this.userIsPro = user && user.pro;
  }

  ngOnInit() {
    this.isLoggedIn = this.session.isLoggedIn();

    if (this.isLoggedIn) {
      this.load();
    }

    this.paramSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        this.currency = params.c || 'usd';
        this.interval = params.i || 'yearly';

        if (params.c || params.i) {
          if (this.currency === 'tokens') {
            this.interval = 'lifetime';
          }
          this.enable();
        }
      }
    );
  }

  async load() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      this.active = await this.service.isActive();
      this.hasSubscription = await this.service.hasSubscription();
      this.expires = await this.service.expires();
    } catch (e) {
      this.criticalError = true;
      this.error = (e && e.message) || 'Unknown error';
      this.toasterService.error(this.error);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async enable() {
    // if (!this.session.isLoggedIn()) {
    //   localStorage.setItem(
    //     'redirect',
    //     `/plus?c=${this.currency}&i=${this.interval}`
    //   );
    //   this.router.navigate(['/login']);
    //   return;
    // }

    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      const modal = this.modalService.present(WireCreatorComponent, {
        size: 'lg',
        data: {
          entity: await this.wirePaymentHandlers.get('plus'),
          default: {
            type: this.currency === 'usd' ? 'money' : 'tokens',
            upgradeType: 'plus',
            upgradeInterval: this.interval,
          },
          onComplete: () => {
            this.paymentComplete();
            modal.close();
          },
        },
      });
      await modal.result;
      this.inProgress = false;
      this.detectChanges();
    } catch (e) {
      this.active = false;
      this.hasSubscription = false;
      this.session.getLoggedInUser().plus = false;
      this.error = (e && e.message) || 'Unknown error';
      this.toasterService.error(this.error);
      this.inProgress = false;
    }

    this.detectChanges();
  }

  paymentComplete() {
    this.active = true;
    this.hasSubscription = true;
    this.session.getLoggedInUser().plus = true;
    this.onEnable.emit(Date.now());
    this.inProgress = false;
    this.detectChanges();

    this.toasterService.success('Welcome to Minds+');
  }

  async disable() {
    if (!confirm('Click OK if you want to cancel your Plus subscription...')) {
      return;
    }

    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      await this.service.disable();
      this.hasSubscription = false;
      this.onDisable.emit(Date.now());
    } catch (e) {
      this.error = (e && e.message) || 'Unknown error';
      this.toasterService.error(this.error);
      this.hasSubscription = true;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  get pricing() {
    if (this.currency !== 'tokens') {
      if (this.interval === 'yearly') {
        return {
          amount: currency(
            this.upgrades.plus.yearly[this.currency] / 12,
            this.currency
          ),
          offerFrom: currency(
            this.upgrades.plus.monthly[this.currency],
            this.currency
          ),
          annualAmount: currency(
            this.upgrades.plus.yearly[this.currency],
            this.currency
          ),
        };
      } else if (this.interval === 'monthly') {
        return {
          amount: currency(
            this.upgrades.plus.monthly[this.currency],
            this.currency
          ),
          offerFrom: null,
          annualAmount: null,
        };
      }
    } else {
      this.interval = 'lifetime';
      return {
        amount: this.upgrades.plus.lifetime[this.currency],
        offerFrom: null,
        annualAmount: null,
      };
    }
  }

  get canHaveTrial(): boolean {
    return (
      this.currency === 'usd' &&
      (this.upgrades.plus[this.interval].can_have_trial ||
        !this.session.isLoggedIn())
    );
  }

  get expiryString(): string {
    if (this.expires * 1000 <= Date.now()) {
      return '';
    }

    return moment(this.expires * 1000)
      .local()
      .format('h:mma [on] MMM Do, YYYY');
  }

  get upgradeButtonDisabled(): boolean {
    const cancelledButNotExpired = !this.hasSubscription && this.active;
    return this.userIsPro || cancelledButNotExpired;
  }

  setCurrency(currency: UpgradeOptionCurrency) {
    this.currency = currency;
    if (this.currency === 'usd') {
      this.interval = 'yearly';
    } else if (this.currency === 'tokens') {
      this.interval = 'lifetime';
    }
  }

  setInterval(interval: UpgradeOptionInterval) {
    this.interval = interval;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }
}
